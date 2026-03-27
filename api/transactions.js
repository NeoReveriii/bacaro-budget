import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

const sql = neon(process.env.DATABASE_URL);
const AUTH_SECRET = process.env.AUTH_SECRET;

const EXPECTED_TRANSACTION_COLUMNS = [
  'trans_id',
  'description',
  'type',
  'wallet_type',
  'wallet_id',
  'amount',
  'account_id',
  'dateoftrans'
];

function getBearerToken(req) {
  const header = req.headers?.authorization || req.headers?.Authorization;
  if (!header || typeof header !== 'string') return null;
  const m = header.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

function verifyToken(token) {
  if (!token) return null;

  try {
    // Signed token format: <base64body>.<hexsig>
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

    // Legacy unsigned token (dev only)
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

async function getTransactionColumns() {
  const cols = await sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'transactions'
  `;
  return new Set(cols.map(c => String(c.column_name).toLowerCase()));
}

async function ensureTransactionsSchema() {
  // 1) Create table if missing (authoritative schema)
  const reg = await sql`SELECT to_regclass('public.transactions') AS reg`;
  const exists = Boolean(reg?.[0]?.reg);

  if (!exists) {
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        trans_id SERIAL PRIMARY KEY,
        description TEXT NOT NULL,
        type TEXT NOT NULL,
        wallet_type TEXT NOT NULL,
        amount NUMERIC(12,2) NOT NULL,
        account_id INTEGER NOT NULL REFERENCES accounts(acc_id),
        dateoftrans TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    return;
  }

  // 2) Best-effort migrations from legacy column names
  const cols = await getTransactionColumns();
  const tryExec = async (q) => {
    try {
      await q;
      return true;
    } catch {
      return false;
    }
  };

  if (!cols.has('trans_id') && cols.has('id')) {
    await tryExec(sql`ALTER TABLE transactions RENAME COLUMN id TO trans_id`);
  }
  if (!cols.has('description') && cols.has('title')) {
    await tryExec(sql`ALTER TABLE transactions RENAME COLUMN title TO description`);
  }
  if (!cols.has('wallet_type') && cols.has('wallet')) {
    await tryExec(sql`ALTER TABLE transactions RENAME COLUMN wallet TO wallet_type`);
  }
  if (!cols.has('dateoftrans') && cols.has('date')) {
    await tryExec(sql`ALTER TABLE transactions RENAME COLUMN date TO dateoftrans`);
  }

  // 3) Add missing columns (without dropping extras)
  const cols2 = await getTransactionColumns();
  if (!cols2.has('description')) {
    await tryExec(sql`ALTER TABLE transactions ADD COLUMN description TEXT`);
  }
  if (!cols2.has('type')) {
    await tryExec(sql`ALTER TABLE transactions ADD COLUMN type TEXT`);
  }
  if (!cols2.has('wallet_type')) {
    await tryExec(sql`ALTER TABLE transactions ADD COLUMN wallet_type TEXT`);
  }
  if (!cols2.has('amount')) {
    await tryExec(sql`ALTER TABLE transactions ADD COLUMN amount NUMERIC(12,2)`);
  }
  if (!cols2.has('account_id')) {
    await tryExec(sql`ALTER TABLE transactions ADD COLUMN account_id INTEGER REFERENCES accounts(acc_id)`);
  }
  if (!cols2.has('dateoftrans')) {
    await tryExec(sql`ALTER TABLE transactions ADD COLUMN dateoftrans TIMESTAMPTZ`);
  }
  if (!cols2.has('wallet_id')) {
    await tryExec(sql`ALTER TABLE transactions ADD COLUMN wallet_id INTEGER REFERENCES wallets(wallet_id)`);
    
    // Migration: Populate wallet_id based on wallet_type (name)
    await tryExec(sql`
      UPDATE transactions t
      SET wallet_id = w.wallet_id
      FROM wallets w
      WHERE t.wallet_type = w.name AND t.account_id = w.account_id AND t.wallet_id IS NULL
    `);
  }

  // 4) Ensure primary key exists on trans_id (if possible)
  await tryExec(sql`ALTER TABLE transactions ADD PRIMARY KEY (trans_id)`);

  // 5) Ensure sensible types where safe
  await tryExec(sql`ALTER TABLE transactions ALTER COLUMN amount TYPE NUMERIC(12,2) USING amount::numeric`);
  await tryExec(sql`ALTER TABLE transactions ALTER COLUMN account_id TYPE INTEGER USING account_id::integer`);
  await tryExec(sql`ALTER TABLE transactions ALTER COLUMN dateoftrans TYPE TIMESTAMPTZ USING dateoftrans::timestamptz`);

  // 6) Ensure auto-increment behavior when possible
  await tryExec(sql`ALTER TABLE transactions ALTER COLUMN trans_id ADD GENERATED BY DEFAULT AS IDENTITY`);

  // 7) Performance Indexes
  await tryExec(sql`CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id)`);
  await tryExec(sql`CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id)`);
}

function normalizeType(value) {
  const t = String(value || '').trim();
  if (!t) return '';
  const lower = t.toLowerCase();
  if (lower === 'income' || lower === 'expense' || lower === 'transfer') return lower[0].toUpperCase() + lower.slice(1);
  return t;
}

export default async function handler(req, res) {
  const { method } = req;

  try {
    const account = await requireAccount(req, res);
    if (!account) return;

    await ensureTransactionsSchema();
    const cols = await getTransactionColumns();
    const missing = EXPECTED_TRANSACTION_COLUMNS.filter(c => !cols.has(c));

    if (method === 'GET') {
      if (missing.length > 0) {
        return res.status(500).json({
          error: 'Unsupported transactions table schema',
          expected_columns: EXPECTED_TRANSACTION_COLUMNS,
          actual_columns: Array.from(cols.values()).sort(),
          missing_columns: missing
        });
      }

      const rows = await sql`
        SELECT trans_id, description, type, wallet_type, wallet_id, amount, account_id, dateoftrans
        FROM transactions
        WHERE account_id = ${account.acc_id}
        ORDER BY dateoftrans DESC
        LIMIT 50
      `;
      return res.status(200).json(rows);

    } else if (method === 'POST') {
      const action = String(req.query?.action || '').toLowerCase();

      if (action === 'transfer') {
        const fromWalletId = req.body?.from_wallet_id ? parseInt(req.body.from_wallet_id, 10) : null;
        const toWalletId = req.body?.to_wallet_id ? parseInt(req.body.to_wallet_id, 10) : null;
        const amountNum = Number(req.body?.amount);

        if (!fromWalletId || !toWalletId) {
          return res.status(400).json({ error: 'from_wallet_id and to_wallet_id are required' });
        }
        if (fromWalletId === toWalletId) {
          return res.status(400).json({ error: 'Cannot transfer to the same wallet' });
        }
        if (!Number.isFinite(amountNum) || amountNum <= 0) {
          return res.status(400).json({ error: 'Amount must be a number greater than 0' });
        }

        if (missing.length > 0) {
          return res.status(500).json({
            error: 'Unsupported transactions table schema',
            expected_columns: EXPECTED_TRANSACTION_COLUMNS,
            actual_columns: Array.from(cols.values()).sort(),
            missing_columns: missing
          });
        }

        const walletRows = await sql`
          SELECT wallet_id, name, status
          FROM wallets
          WHERE account_id = ${account.acc_id}
            AND wallet_id IN (${fromWalletId}, ${toWalletId})
        `;

        if (walletRows.length !== 2) {
          return res.status(404).json({ error: 'One or both wallets not found' });
        }

        const fromWallet = walletRows.find(w => Number(w.wallet_id) === fromWalletId);
        const toWallet = walletRows.find(w => Number(w.wallet_id) === toWalletId);

        if (!fromWallet || !toWallet) {
          return res.status(404).json({ error: 'One or both wallets not found' });
        }

        const fromStatus = String(fromWallet.status || '').toUpperCase();
        const toStatus = String(toWallet.status || '').toUpperCase();
        if (fromStatus && fromStatus !== 'ACTIVE') {
          return res.status(400).json({ error: `Source wallet \"${fromWallet.name}\" is not ACTIVE` });
        }
        if (toStatus && toStatus !== 'ACTIVE') {
          return res.status(400).json({ error: `Destination wallet \"${toWallet.name}\" is not ACTIVE` });
        }

        const balanceRows = await sql`
          SELECT
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
            ) AS current_balance
          FROM wallets w
          LEFT JOIN transactions t
            ON t.wallet_id = w.wallet_id AND t.account_id = w.account_id
          WHERE w.account_id = ${account.acc_id}
            AND w.wallet_id = ${fromWalletId}
          GROUP BY w.wallet_id
        `;

        const currentBalance = Number(balanceRows?.[0]?.current_balance ?? 0);
        if (currentBalance < amountNum) {
          return res.status(400).json({
            error: `Insufficient funds in source wallet. Available: ${currentBalance.toFixed(2)}`
          });
        }

        const now = new Date();
        const transferRows = await sql`
          INSERT INTO transactions (description, type, wallet_type, wallet_id, amount, account_id, dateoftrans)
          VALUES
            (${`Transfer to ${toWallet.name}`}, 'Transfer', ${fromWallet.name}, ${fromWalletId}, ${amountNum}, ${account.acc_id}, ${now}),
            (${`Transfer from ${fromWallet.name}`}, 'Transfer', ${toWallet.name}, ${toWalletId}, ${amountNum}, ${account.acc_id}, ${now})
          RETURNING trans_id, description, type, wallet_type, wallet_id, amount, account_id, dateoftrans
        `;

        return res.status(201).json({
          success: true,
          message: 'Transfer completed successfully',
          rows: transferRows
        });
      }

      const description = String(req.body?.description ?? req.body?.title ?? '').trim();
      const type = normalizeType(req.body?.type);
      const walletType = String(req.body?.wallet_type ?? req.body?.wallet ?? '').trim();
      const walletId = req.body?.wallet_id ? parseInt(req.body.wallet_id) : null;
      const amountNum = Number(req.body?.amount);

      if (!description || !type || !walletType) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      if (!Number.isFinite(amountNum) || amountNum <= 0) {
        return res.status(400).json({ error: 'Amount must be a number greater than 0' });
      }

      const now = new Date();

      if (missing.length > 0) {
        return res.status(500).json({
          error: 'Unsupported transactions table schema',
          expected_columns: EXPECTED_TRANSACTION_COLUMNS,
          actual_columns: Array.from(cols.values()).sort(),
          missing_columns: missing
        });
      }

      const inserted = await sql`
        INSERT INTO transactions (description, type, wallet_type, wallet_id, amount, account_id, dateoftrans)
        VALUES (${description}, ${type}, ${walletType}, ${walletId}, ${amountNum}, ${account.acc_id}, ${now})
        RETURNING trans_id, description, type, wallet_type, wallet_id, amount, account_id, dateoftrans
      `;
      return res.status(201).json(inserted[0]);

    } else if (method === 'PUT') {
      const id = req.body?.trans_id ?? req.body?.id;
      if (!id) return res.status(400).json({ error: 'Transaction ID required' });

      // Minimal secure update: only allow updating own rows when account_id exists
      const patchDescription = req.body?.description ?? req.body?.title ?? null;
      const patchType = req.body?.type ?? null;
      const patchWallet = req.body?.wallet_type ?? req.body?.wallet ?? null;
      const patchWalletId = req.body?.wallet_id ? parseInt(req.body.wallet_id) : null;
      const patchAmount = req.body?.amount ?? null;

      if (missing.length > 0) {
        return res.status(500).json({
          error: 'Unsupported transactions table schema',
          expected_columns: EXPECTED_TRANSACTION_COLUMNS,
          actual_columns: Array.from(cols.values()).sort(),
          missing_columns: missing
        });
      }

      const updated = await sql`
        UPDATE transactions
        SET description = COALESCE(${patchDescription}, description),
            type = COALESCE(${patchType}, type),
            wallet_type = COALESCE(${patchWallet}, wallet_type),
            wallet_id = COALESCE(${patchWalletId}, wallet_id),
            amount = COALESCE(${patchAmount}, amount)
        WHERE trans_id = ${id} AND account_id = ${account.acc_id}
        RETURNING trans_id, description, type, wallet_type, wallet_id, amount, account_id, dateoftrans
      `;
      return res.status(200).json(updated[0] || null);

    } else if (method === 'DELETE') {
      const id = req.body?.trans_id ?? req.body?.id;
      if (!id) return res.status(400).json({ error: 'Transaction ID required' });

      if (missing.length > 0) {
        return res.status(500).json({
          error: 'Unsupported transactions table schema',
          expected_columns: EXPECTED_TRANSACTION_COLUMNS,
          actual_columns: Array.from(cols.values()).sort(),
          missing_columns: missing
        });
      }

      const deleted = await sql`
        DELETE FROM transactions
        WHERE trans_id = ${id} AND account_id = ${account.acc_id}
        RETURNING trans_id, description, type, wallet_type, amount, account_id, dateoftrans
      `;
      return res.status(200).json(deleted[0] || null);

    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.error('Transactions API error:', {
      method,
      message: err?.message,
      stack: err?.stack
    });
    res.status(500).json({ error: 'Database error', details: err?.message || String(err) });
  }
}
