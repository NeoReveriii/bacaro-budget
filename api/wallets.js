import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

const sql = neon(process.env.DATABASE_URL);
const AUTH_SECRET = process.env.AUTH_SECRET;

function getBearerToken(req) {
  const header = req.headers?.authorization || req.headers?.Authorization;
  if (!header || typeof header !== 'string') return null;
  const m = header.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

function verifyToken(token) {
  if (!token) return null;

  try {
    if (token.includes('.')) {
      const [body, sig] = token.split('.');
      if (!body || !sig) return null;
      if (!AUTH_SECRET) return null;

      const expected = crypto.createHmac('sha256', AUTH_SECRET).update(body).digest('hex');
      const a = Buffer.from(sig, 'utf8');
      const b = Buffer.from(expected, 'utf8');
      if (a.length !== b.length) return null;
      if (!crypto.timingSafeEqual(a, b)) return null;

      return JSON.parse(Buffer.from(body, 'base64').toString('utf8'));
    }

    const parsed = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    return parsed;
  } catch {
    return null;
  }
}

async function requireAccount(req, res) {
  const token = getBearerToken(req);
  const payload = verifyToken(token);
  const accId = payload?.acc_id;
  const email = payload?.email;

  if (!accId || !email) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  const rows = await sql`
    SELECT acc_id, email
    FROM accounts
    WHERE acc_id = ${accId} AND email = ${email}
    LIMIT 1
  `;

  if (rows.length === 0) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  return { acc_id: rows[0].acc_id };
}

async function ensureWalletsSchema() {
  const reg = await sql`SELECT to_regclass('public.wallets') AS reg`;
  const exists = Boolean(reg?.[0]?.reg);

  if (!exists) {
    await sql`
      CREATE TABLE IF NOT EXISTS wallets (
        wallet_id SERIAL PRIMARY KEY,
        account_id INTEGER NOT NULL REFERENCES accounts(acc_id),
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        initial_balance NUMERIC(12,2) NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
  }
}

export default async function handler(req, res) {
  try {
    const account = await requireAccount(req, res);
    if (!account) return;

    await ensureWalletsSchema();

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT 
          w.wallet_id, 
          w.name, 
          w.type, 
          w.initial_balance, 
          w.status,
          w.created_at,
          (
            w.initial_balance + 
            COALESCE(SUM(CASE 
              WHEN t.type = 'Income' THEN t.amount 
              WHEN t.type = 'Transfer' AND (t.description ILIKE 'Transfer from%' OR t.description ILIKE 'Transfer In from%') THEN t.amount
              ELSE 0 END), 0) - 
            COALESCE(SUM(CASE 
              WHEN t.type = 'Expense' THEN t.amount 
              WHEN t.type = 'Transfer' AND (t.description ILIKE 'Transfer to%' OR t.description ILIKE 'Transfer Out to%') THEN t.amount
              ELSE 0 END), 0)
          ) as calculated_balance
        FROM wallets w
        LEFT JOIN transactions t 
          ON t.wallet_id = w.wallet_id AND t.account_id = w.account_id
        WHERE w.account_id = ${account.acc_id}
        GROUP BY w.wallet_id
        ORDER BY w.created_at ASC
      `;
      return res.status(200).json({ wallets: rows });
    }

    if (req.method === 'POST') {
      const { name, type, initial_balance } = req.body;
      const parsedBalance = parseFloat(initial_balance) || 0;

      if (!name || !type) {
        return res.status(400).json({ error: 'Name and type are required' });
      }

      const rows = await sql`
        INSERT INTO wallets (account_id, name, type, initial_balance)
        VALUES (${account.acc_id}, ${name}, ${type}, ${parsedBalance})
        RETURNING *
      `;
      return res.status(201).json({ message: 'Wallet created', wallet: rows[0] });
    }

    if (req.method === 'PUT') {
      const { wallet_id, name, type, status, initial_balance } = req.body;
      
      if (!wallet_id || !name || !type) {
        return res.status(400).json({ error: 'wallet_id, name, and type are required' });
      }

      const oldWalletRows = await sql`SELECT name FROM wallets WHERE wallet_id = ${wallet_id} AND account_id = ${account.acc_id}`;
      if (oldWalletRows.length === 0) {
        return res.status(404).json({ error: 'Wallet not found' });
      }
      const oldName = oldWalletRows[0].name;

      const parsedBalance = parseFloat(initial_balance) || 0;

      const rows = await sql`
        UPDATE wallets
        SET name = ${name}, type = ${type}, status = ${status || 'ACTIVE'}, initial_balance = ${parsedBalance}
        WHERE wallet_id = ${wallet_id} AND account_id = ${account.acc_id}
        RETURNING *
      `;
      
      if (oldName !== name) {
        await sql`
          UPDATE transactions 
          SET wallet_type = ${name} 
          WHERE wallet_type = ${oldName} AND account_id = ${account.acc_id}
        `;
      }

      return res.status(200).json({ message: 'Wallet updated', wallet: rows[0] });
    }

    if (req.method === 'DELETE') {
      const { wallet_id } = req.body;
      if (!wallet_id) {
        return res.status(400).json({ error: 'wallet_id is required' });
      }

      // Check if wallet has transactions
      const walletRows = await sql`SELECT name FROM wallets WHERE wallet_id = ${wallet_id} AND account_id = ${account.acc_id}`;
      if (walletRows.length === 0) return res.status(404).json({ error: 'Wallet not found' });
      const walletName = walletRows[0].name;

      const transCheck = await sql`
        SELECT COUNT(*) as count FROM transactions 
        WHERE account_id = ${account.acc_id}
          AND (
            wallet_id = ${wallet_id}
            OR (wallet_id IS NULL AND wallet_type = ${walletName})
          )
      `;
      if (parseInt(transCheck[0].count) > 0) {
        return res.status(400).json({ error: 'Cannot delete a wallet that has transactions. Delete or reassign the transactions first.' });
      }
      
      await sql`
        DELETE FROM wallets 
        WHERE wallet_id = ${wallet_id} AND account_id = ${account.acc_id}
      `;
      return res.status(200).json({ message: 'Wallet deleted' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Wallets API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}