import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';
import { sendPasswordResetEmail } from './mailer.js';

function getSql() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not configured');
  }
  return neon(dbUrl);
}

async function parseRequestBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  if (typeof req.body === 'string' && req.body.trim()) {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

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
  const body = await parseRequestBody(req);
  const email = String(body?.email || '').trim();

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const sql = getSql();

    const accounts = await sql`
      SELECT acc_id, username, email
      FROM accounts
      WHERE LOWER(email) = LOWER(${email})
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
    await sql`DELETE FROM "PasswordResetTokens" WHERE "userId" = ${user.acc_id}`;
    await sql`
      INSERT INTO "PasswordResetTokens" ("userId", "tokenHash", "expiresAt")
      VALUES (${user.acc_id}, ${tokenHash}, ${expiresAt})
    `;

    const delivery = await sendPasswordResetEmail(user.email, resetToken, user.username);

    return res.status(200).json({
      message: 'If an account exists, a password reset link has been sent to your email',
      delivery: {
        acceptedCount: Array.isArray(delivery?.accepted) ? delivery.accepted.length : 0,
        messageId: delivery?.messageId || null
      }
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      error: 'Forgot password request failed',
      details: error?.message || 'Unknown error'
    });
  }
}

async function handleResetPassword(req, res) {
  const body = await parseRequestBody(req);
  const token = String(body?.token || '').trim();
  const newPassword = String(body?.newPassword || '');
  const confirmPassword = String(body?.confirmPassword || '');

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
    const sql = getSql();

    const tokenHash = hashToken(token);

    const records = await sql`
      SELECT t.id, t."userId", a.email, a.username
      FROM "PasswordResetTokens" t
      JOIN accounts a ON t."userId" = a.acc_id
      WHERE t."tokenHash" = ${tokenHash}
        AND t."expiresAt" > NOW()
      LIMIT 1
    `;

    if (records.length === 0) {
      return res.status(400).json({
        error: 'Invalid or expired reset link. Please request a new one.'
      });
    }

    const { id: resetId, userId: accountId } = records[0];
    const hashedPassword = hashPassword(newPassword);

    const updated = await sql`
      UPDATE accounts
      SET password = ${hashedPassword}
      WHERE acc_id = ${accountId}
      RETURNING acc_id
    `;

    if (updated.length === 0) {
      return res.status(500).json({ error: 'Password update failed: account not found' });
    }

    await sql`DELETE FROM "PasswordResetTokens" WHERE id = ${resetId}`;

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      error: 'Reset password request failed',
      details: error?.message || 'Unknown error'
    });
  }
}

async function handleVerifyToken(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const sql = getSql();

    const tokenHash = hashToken(token);

    const records = await sql`
      SELECT a.email, a.username
      FROM "PasswordResetTokens" t
      JOIN accounts a ON t."userId" = a.acc_id
      WHERE t."tokenHash" = ${tokenHash}
        AND t."expiresAt" > NOW()
      LIMIT 1
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
    return res.status(500).json({
      error: 'Token verification failed',
      details: error?.message || 'Unknown error'
    });
  }
}

export default async function handler(req, res) {
  const { method, query } = req;

  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: 'Server is missing DATABASE_URL configuration' });
    }

    if (method === 'POST' && query.action === 'forgot') {
      return handleForgotPassword(req, res);
    } else if (method === 'POST' && query.action === 'reset') {
      return handleResetPassword(req, res);
    } else if (method === 'GET' && query.action === 'verify') {
      return handleVerifyToken(req, res);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Reset API unhandled error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
