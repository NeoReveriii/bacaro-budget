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

async function ensureGoalsSchema() {
  const reg = await sql`SELECT to_regclass('public.goals') AS reg`;
  const exists = Boolean(reg?.[0]?.reg);

  if (!exists) {
    await sql`
      CREATE TABLE IF NOT EXISTS goals (
        goal_id SERIAL PRIMARY KEY,
        account_id INTEGER NOT NULL REFERENCES accounts(acc_id),
        title TEXT NOT NULL,
        category TEXT,
        priority INTEGER DEFAULT 1,
        target_amount NUMERIC(12,2) NOT NULL,
        current_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
        deadline DATE,
        status TEXT DEFAULT 'Active',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
  } else {
    // Migration for existing table
    const cols = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'goals'
    `;
    const colNames = cols.map(c => c.column_name);
    
    if (!colNames.includes('category')) {
      await sql`ALTER TABLE goals ADD COLUMN category TEXT`;
    }
    if (!colNames.includes('priority')) {
      await sql`ALTER TABLE goals ADD COLUMN priority INTEGER DEFAULT 1`;
    }
    if (!colNames.includes('status')) {
      await sql`ALTER TABLE goals ADD COLUMN status TEXT DEFAULT 'Active'`;
    }
    if (!colNames.includes('allow_expense')) {
      await sql`ALTER TABLE goals ADD COLUMN allow_expense BOOLEAN NOT NULL DEFAULT FALSE`;
    }
  }

  // Ensure history table exists
  await sql`
    CREATE TABLE IF NOT EXISTS goal_contributions (
      contribution_id SERIAL PRIMARY KEY,
      goal_id INTEGER NOT NULL REFERENCES goals(goal_id) ON DELETE CASCADE,
      amount NUMERIC(12,2) NOT NULL,
      note TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export default async function handler(req, res) {
  try {
    const account = await requireAccount(req, res);
    if (!account) return;

    await ensureGoalsSchema();

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT 
          g.goal_id, 
          g.title, 
          g.category,
          g.priority,
          g.target_amount, 
          g.current_amount, 
          g.deadline,
          g.status,
          g.allow_expense,
          g.created_at,
          (
            SELECT json_agg(h) 
            FROM (
              SELECT amount, note, created_at 
              FROM goal_contributions 
              WHERE goal_id = g.goal_id 
              ORDER BY created_at DESC 
              LIMIT 10
            ) h
          ) as history
        FROM goals g
        WHERE g.account_id = ${account.acc_id}
        ORDER BY g.created_at DESC
      `;
      return res.status(200).json({ goals: rows });
    }

    if (req.method === 'POST') {
      const { title, target_amount, deadline, category, priority, allow_expense } = req.body;
      if (!title || !target_amount) {
        return res.status(400).json({ error: 'Missing title or target amount.' });
      }

      // Validate deadline is not in the past
      if (deadline) {
        const selectedDate = new Date(deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        
        if (selectedDate < today) {
          return res.status(400).json({ error: 'Please select a valid future date.' });
        }
      }

      const allowExpenseBool = allow_expense === true || allow_expense === 'true';
      const rows = await sql`
        INSERT INTO goals (account_id, title, target_amount, deadline, category, priority, allow_expense)
        VALUES (${account.acc_id}, ${title}, ${target_amount}, ${deadline || null}, ${category || 'Savings'}, ${priority || 1}, ${allowExpenseBool})
        RETURNING *
      `;

      return res.status(201).json({ goal: rows[0] });
    }

    if (req.method === 'PUT') {
      const { goal_id, add_amount, note } = req.body;
      // allow negative add_amount (expense withdrawals from goal)
      if (!goal_id || add_amount == null || !Number.isFinite(Number(add_amount))) {
        return res.status(400).json({ error: 'Missing goal_id or valid amount.' });
      }

      // 1. Update Goal Amount
      const rows = await sql`
        UPDATE goals
        SET current_amount = current_amount + ${add_amount}
        WHERE goal_id = ${goal_id} AND account_id = ${account.acc_id}
        RETURNING *
      `;

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Goal not found or access denied.' });
      }

      // 2. Record Contribution History
      await sql`
        INSERT INTO goal_contributions (goal_id, amount, note)
        VALUES (${goal_id}, ${add_amount}, ${note || 'Manual add'})
      `;

      return res.status(200).json({ goal: rows[0] });
    }

    if (req.method === 'DELETE') {
      const { goal_id } = req.body;
      if (!goal_id) {
        return res.status(400).json({ error: 'Missing goal_id' });
      }

      const rows = await sql`
        DELETE FROM goals
        WHERE goal_id = ${goal_id} AND account_id = ${account.acc_id}
        RETURNING goal_id
      `;

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Goal not found or access denied.' });
      }

      return res.status(200).json({ success: true, deleted_goal_id: goal_id });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error('Goals API Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}