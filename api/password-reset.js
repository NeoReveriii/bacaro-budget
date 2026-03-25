import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { sendPasswordResetEmail } from './email-service.js';
import { ensurePasswordResetSchema, ensureAccountsSchema } from './schema.js';

const sql = neon(process.env.DATABASE_URL);

// Generate secure reset token
function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function hashPassword(password) {
  // Using bcrypt for better security
  return bcrypt.hashSync(password, 10);
}

async function verifyPassword(inputPassword, hashedPassword) {
  return bcrypt.compare(inputPassword, hashedPassword);
}

async function handleForgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    await ensurePasswordResetSchema();
    await ensureAccountsSchema();

    // Check rate limiting (max 3 attempts per 15 minutes)
    const account = await sql`
      SELECT acc_id, username, email, password_reset_locked_until, password_reset_attempts
      FROM accounts
      WHERE email = ${email.toLowerCase()}
    `;

    // Security: Don't reveal if email exists
    if (account.length === 0) {
      return res.status(200).json({
        message: 'If an account exists, a password reset link has been sent to your email'
      });
    }

    const user = account[0];

    // Check if account is locked due to too many attempts
    if (user.password_reset_locked_until && new Date(user.password_reset_locked_until) > new Date()) {
      return res.status(429).json({
        error: 'Too many reset attempts. Please try again later.'
      });
    }

    // Clean up expired tokens
    await sql`
      DELETE FROM password_resets
      WHERE account_id = ${user.acc_id} AND expires_at < NOW()
    `;

    // Generate reset token (valid for 1 hour)
    const resetToken = generateResetToken();
    const tokenHash = hashToken(resetToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token in database
    await sql`
      INSERT INTO password_resets (account_id, reset_token, token_hash, expires_at, ip_address, user_agent)
      VALUES (${user.acc_id}, ${resetToken}, ${tokenHash}, ${expiresAt}, ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}, ${req.headers['user-agent']})
    `;

    // Send email
    await sendPasswordResetEmail(user.email, resetToken, user.username);

    // Reset attempt counter on successful request
    await sql`
      UPDATE accounts
      SET password_reset_attempts = 0
      WHERE acc_id = ${user.acc_id}
    `;

    return res.status(200).json({
      message: 'If an account exists, a password reset link has been sent to your email'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'An error occurred. Please try again later.' });
  }
}

async function handleResetPassword(req, res) {
  const { token, newPassword, confirmPassword } = req.body;

  if (!token || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'Token and passwords are required' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    await ensurePasswordResetSchema();

    const tokenHash = hashToken(token);

    // Find valid reset token
    const resetRecord = await sql`
      SELECT pr.reset_id, pr.account_id, pr.expires_at, pr.used_at, a.email, a.username
      FROM password_resets pr
      JOIN accounts a ON pr.account_id = a.acc_id
      WHERE pr.token_hash = ${tokenHash} AND pr.expires_at > NOW() AND pr.used_at IS NULL
      LIMIT 1
    `;

    if (resetRecord.length === 0) {
      return res.status(400).json({
        error: 'Invalid or expired reset link. Please request a new one.'
      });
    }

    const { reset_id, account_id, email, username } = resetRecord[0];

    // Hash the new password using bcrypt
    const hashedPassword = hashPassword(newPassword);

    // Update password and mark token as used
    await sql.transaction(async (tx) => {
      // Update password
      await tx`
        UPDATE accounts
        SET password = ${hashedPassword},
            last_password_reset_at = NOW(),
            password_reset_attempts = 0,
            password_reset_locked_until = NULL
        WHERE acc_id = ${account_id}
      `;

      // Mark token as used
      await tx`
        UPDATE password_resets
        SET used_at = NOW()
        WHERE reset_id = ${reset_id}
      `;

      // Invalidate all other reset tokens for this account
      await tx`
        UPDATE password_resets
        SET used_at = NOW()
        WHERE account_id = ${account_id} AND reset_id != ${reset_id} AND used_at IS NULL
      `;
    });

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'An error occurred. Please try again later.' });
  }
}

async function handleVerifyToken(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    await ensurePasswordResetSchema();

    const tokenHash = hashToken(token);
    const resetRecord = await sql`
      SELECT a.email, a.username
      FROM password_resets pr
      JOIN accounts a ON pr.account_id = a.acc_id
      WHERE pr.token_hash = ${tokenHash} AND pr.expires_at > NOW() AND pr.used_at IS NULL
      LIMIT 1
    `;

    if (resetRecord.length === 0) {
      return res.status(400).json({ valid: false });
    }

    return res.status(200).json({
      valid: true,
      email: resetRecord[0].email,
      username: resetRecord[0].username
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
}

export default async function handler(req, res) {
  const { method, query } = req;

  try {
    if (method === 'POST' && query.action === 'forgot') {
      return handleForgotPassword(req, res);
    } else if (method === 'POST' && query.action === 'reset') {
      return handleResetPassword(req, res);
    } else if (method === 'GET' && query.action === 'verify') {
      return handleVerifyToken(req, res);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Password reset handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}