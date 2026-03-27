import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';
import { sendPasswordResetEmail } from './mailer.js';
import { ensurePasswordResetSchema } from './schema.js';

const sql = neon(process.env.DATABASE_URL);

function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function handleForgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    await ensurePasswordResetSchema();

    const accounts = await sql`
      SELECT acc_id, username, email
      FROM accounts
      WHERE email = ${email.toLowerCase()}
    `;

    // Security: don't reveal whether the email exists
    if (accounts.length === 0) {
      return res.status(200).json({
        message: 'If an account exists, a password reset link has been sent to your email'
      });
    }

    const user = accounts[0];
    const resetToken = generateResetToken();
    const tokenHash = hashToken(resetToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Remove any existing tokens for this user, then insert new one
    await sql`DELETE FROM password_resets WHERE account_id = ${user.acc_id}`;
    await sql`
      INSERT INTO password_resets (account_id, reset_token, token_hash, expires_at)
      VALUES (${user.acc_id}, ${resetToken}, ${tokenHash}, ${expiresAt})
    `;

    try {
      await sendPasswordResetEmail(user.email, resetToken, user.username);
    } catch (mailError) {
      // Keep response generic to avoid account enumeration and prevent UX-breaking 500s.
      console.error('Password reset email delivery failed:', mailError);
    }

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

    const records = await sql`
      SELECT t.reset_id, t.account_id, a.email, a.username
      FROM password_resets t
      JOIN accounts a ON t.account_id = a.acc_id
      WHERE t.token_hash = ${tokenHash}
        AND t.expires_at > NOW()
        AND t.used_at IS NULL
    `;

    if (records.length === 0) {
      return res.status(400).json({
        error: 'Invalid or expired reset link. Please request a new one.'
      });
    }

    const { reset_id: resetId, account_id: accountId } = records[0];
    const hashedPassword = hashPassword(newPassword);

    await sql`UPDATE accounts SET password = ${hashedPassword} WHERE acc_id = ${accountId}`;
    await sql`UPDATE password_resets SET used_at = NOW() WHERE reset_id = ${resetId}`;

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.'
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

    const records = await sql`
      SELECT a.email, a.username
      FROM password_resets t
      JOIN accounts a ON t.account_id = a.acc_id
      WHERE t.token_hash = ${tokenHash}
        AND t.expires_at > NOW()
        AND t.used_at IS NULL
    `;

    if (records.length === 0) {
      return res.status(400).json({ valid: false });
    }

    return res.status(200).json({
      valid: true,
      email: records[0].email,
      username: records[0].username
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
}

export default async function handler(req, res) {
  const { method, query } = req;

  if (method === 'POST' && query.action === 'forgot') {
    return handleForgotPassword(req, res);
  } else if (method === 'POST' && query.action === 'reset') {
    return handleResetPassword(req, res);
  } else if (method === 'GET' && query.action === 'verify') {
    return handleVerifyToken(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
