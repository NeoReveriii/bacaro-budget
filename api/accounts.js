import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

const sql = neon(process.env.DATABASE_URL);

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export default async function handler(req, res) {
  const { method, query } = req;

  try {
    if (method === 'POST' && query.action === 'login') {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const account = await sql`
        SELECT acc_id, username, email, pnumber, createdat
        FROM accounts
        WHERE email = ${email}
      `;

      if (account.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const storedPassword = await sql`
        SELECT password FROM accounts WHERE email = ${email}
      `;

      const hashedInputPassword = hashPassword(password);
      if (storedPassword[0].password !== hashedInputPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = Buffer.from(
        JSON.stringify({
          id: account[0].id,
          email: account[0].email,
          username: account[0].username,
          timestamp: Date.now()
        })
      ).toString('base64');

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        data: account[0]
      });

    } else if (method === 'POST') {
      const { username, email, password, pnumber } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
      }

      if (username.length < 3) {
        return res.status(400).json({ error: 'Username must be at least 3 characters' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const emailExists = await sql`
        SELECT id FROM accounts WHERE email = ${email}
      `;

      if (emailExists.length > 0) {
        return res.status(409).json({ error: 'Email already exists' });
      }

      const usernameExists = await sql`
        SELECT id FROM accounts WHERE username = ${username}
      `;

      if (usernameExists.length > 0) {
        return res.status(409).json({ error: 'Username already exists' });
      }

      const hashedPassword = hashPassword(password);
      const inserted = await sql`
        INSERT INTO accounts (username, email, password, pnumber)
        VALUES (${username}, ${email}, ${hashedPassword}, ${pnumber || null})
        RETURNING acc_id, username, email, pnumber, createdat
      `;

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: inserted[0]
      });

    } else if (method === 'GET') {
      const accounts = await sql`
        SELECT acc_id, username, email, pnumber, createdat
        FROM accounts
      `;

      res.status(200).json(accounts);

    } else if (method === 'PUT') {
      const { id, username, email, pnumber } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Account ID required' });
      }

      const updated = await sql`
        UPDATE accounts
        SET username = COALESCE(${username}, username),
            email = COALESCE(${email}, email),
            pnumber = COALESCE(${pnumber}, pnumber)
        WHERE acc_id = ${id}
        RETURNING acc_id, username, email, pnumber, createdat
      `;

      if (updated.length === 0) {
        return res.status(404).json({ error: 'Account not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Account updated successfully',
        data: updated[0]
      });

    } else if (method === 'DELETE') {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Account ID required' });
      }

      const deleted = await sql`
        DELETE FROM accounts WHERE acc_id = ${id}
        RETURNING acc_id
      `;

      if (deleted.length === 0) {
        return res.status(404).json({ error: 'Account not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Account deleted successfully'
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Account error:', error);
    res.status(500).json({ error: error.message });
  }
}
