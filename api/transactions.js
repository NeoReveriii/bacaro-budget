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

    const cols = await getTransactionColumns();
    const hasNewSchema =
      cols.has('description') &&
      cols.has('wallet_type') &&
      cols.has('dateoftrans') &&
      cols.has('account_id');

    const hasLegacySchema = cols.has('title') && cols.has('wallet');
    const hasAccountId = cols.has('account_id');
    const hasLegacyDate = cols.has('date');
    const hasLegacyId = cols.has('id');
    const hasNewId = cols.has('trans_id');

    if (method === 'GET') {
      if (hasNewSchema) {
        const rows = await sql`
          SELECT trans_id, description, type, wallet_type, amount, account_id, dateoftrans
          FROM transactions
          WHERE account_id = ${account.acc_id}
          ORDER BY dateoftrans DESC
          LIMIT 50
        `;
        return res.status(200).json(rows);
      }

      if (hasLegacySchema) {
        if (hasAccountId && hasLegacyDate) {
          const rows = await sql`
            SELECT *
            FROM transactions
            WHERE account_id = ${account.acc_id}
            ORDER BY date DESC
            LIMIT 50
          `;
          return res.status(200).json(rows);
        }
        if (hasAccountId) {
          const rows = hasLegacyId
            ? await sql`
                SELECT *
                FROM transactions
                WHERE account_id = ${account.acc_id}
                ORDER BY id DESC
                LIMIT 50
              `
            : await sql`
                SELECT *
                FROM transactions
                WHERE account_id = ${account.acc_id}
                ORDER BY title DESC
                LIMIT 50
              `;
          return res.status(200).json(rows);
        }
        if (hasLegacyDate) {
          const rows = await sql`
            SELECT *
            FROM transactions
            ORDER BY date DESC
            LIMIT 50
          `;
          return res.status(200).json(rows);
        }
        const rows = hasLegacyId
          ? await sql`
              SELECT *
              FROM transactions
              ORDER BY id DESC
              LIMIT 50
            `
          : await sql`
              SELECT *
              FROM transactions
              ORDER BY title DESC
              LIMIT 50
            `;
        return res.status(200).json(rows);
      }

      return res.status(500).json({ error: 'Unsupported transactions table schema' });

    } else if (method === 'POST') {
      const description = String(req.body?.description ?? req.body?.title ?? '').trim();
      const type = normalizeType(req.body?.type);
      const walletType = String(req.body?.wallet_type ?? req.body?.wallet ?? '').trim();
      const amountNum = Number(req.body?.amount);

      if (!description || !type || !walletType) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      if (!Number.isFinite(amountNum)) {
        return res.status(400).json({ error: 'Amount must be a number' });
      }

      const now = new Date();

      if (hasNewSchema) {
        const inserted = await sql`
          INSERT INTO transactions (description, type, wallet_type, amount, account_id, dateoftrans)
          VALUES (${description}, ${type}, ${walletType}, ${amountNum}, ${account.acc_id}, ${now})
          RETURNING trans_id, description, type, wallet_type, amount, account_id, dateoftrans
        `;
        return res.status(201).json(inserted[0]);
      }

      if (!hasLegacySchema) {
        return res.status(500).json({ error: 'Unsupported transactions table schema' });
      }

      if (hasAccountId && hasLegacyDate) {
        const inserted = await sql`
          INSERT INTO transactions (title, amount, type, wallet, account_id, date)
          VALUES (${description}, ${amountNum}, ${type}, ${walletType}, ${account.acc_id}, ${now})
          RETURNING *
        `;
        return res.status(201).json(inserted[0]);
      }

      if (hasAccountId) {
        const inserted = await sql`
          INSERT INTO transactions (title, amount, type, wallet, account_id)
          VALUES (${description}, ${amountNum}, ${type}, ${walletType}, ${account.acc_id})
          RETURNING *
        `;
        return res.status(201).json(inserted[0]);
      }

      if (hasLegacyDate) {
        const inserted = await sql`
          INSERT INTO transactions (title, amount, type, wallet, date)
          VALUES (${description}, ${amountNum}, ${type}, ${walletType}, ${now})
          RETURNING *
        `;
        return res.status(201).json(inserted[0]);
      }

      const inserted = await sql`
        INSERT INTO transactions (title, amount, type, wallet)
        VALUES (${description}, ${amountNum}, ${type}, ${walletType})
        RETURNING *
      `;
      return res.status(201).json(inserted[0]);

    } else if (method === 'PUT') {
      const id = req.body?.trans_id ?? req.body?.id;
      if (!id) return res.status(400).json({ error: 'Transaction ID required' });

      // Minimal secure update: only allow updating own rows when account_id exists
      const patchDescription = req.body?.description ?? req.body?.title ?? null;
      const patchType = req.body?.type ?? null;
      const patchWallet = req.body?.wallet_type ?? req.body?.wallet ?? null;
      const patchAmount = req.body?.amount ?? null;

      if (hasNewSchema) {
        const updated = await sql`
          UPDATE transactions
          SET description = COALESCE(${patchDescription}, description),
              type = COALESCE(${patchType}, type),
              wallet_type = COALESCE(${patchWallet}, wallet_type),
              amount = COALESCE(${patchAmount}, amount)
          WHERE trans_id = ${id} AND account_id = ${account.acc_id}
          RETURNING trans_id, description, type, wallet_type, amount, account_id, dateoftrans
        `;
        return res.status(200).json(updated[0] || null);
      }

      if (!hasLegacySchema || !hasLegacyId) {
        return res.status(500).json({ error: 'Unsupported transactions table schema' });
      }

      if (!hasAccountId) {
        const updated = await sql`
          UPDATE transactions
          SET title = COALESCE(${patchDescription}, title),
              amount = COALESCE(${patchAmount}, amount),
              type = COALESCE(${patchType}, type),
              wallet = COALESCE(${patchWallet}, wallet)
          WHERE id = ${id}
          RETURNING *
        `;
        return res.status(200).json(updated[0] || null);
      }

      const updatedScoped = await sql`
        UPDATE transactions
        SET title = COALESCE(${patchDescription}, title),
            amount = COALESCE(${patchAmount}, amount),
            type = COALESCE(${patchType}, type),
            wallet = COALESCE(${patchWallet}, wallet)
        WHERE id = ${id} AND account_id = ${account.acc_id}
        RETURNING *
      `;
      return res.status(200).json(updatedScoped[0] || null);

    } else if (method === 'DELETE') {
      const id = req.body?.trans_id ?? req.body?.id;
      if (!id) return res.status(400).json({ error: 'Transaction ID required' });

      if (hasNewSchema) {
        const deleted = await sql`
          DELETE FROM transactions
          WHERE trans_id = ${id} AND account_id = ${account.acc_id}
          RETURNING trans_id, description, type, wallet_type, amount, account_id, dateoftrans
        `;
        return res.status(200).json(deleted[0] || null);
      }

      if (!hasLegacySchema || !hasLegacyId) {
        return res.status(500).json({ error: 'Unsupported transactions table schema' });
      }

      if (!hasAccountId) {
        const deleted = await sql`
          DELETE FROM transactions
          WHERE id = ${id}
          RETURNING *
        `;
        return res.status(200).json(deleted[0] || null);
      }

      const deletedScoped = await sql`
        DELETE FROM transactions
        WHERE id = ${id} AND account_id = ${account.acc_id}
        RETURNING *
      `;
      return res.status(200).json(deletedScoped[0] || null);

    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
}
