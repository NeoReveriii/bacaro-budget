import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    const rows = await sql`
      SELECT id, title, amount, type, date, wallet
      FROM transactions
      ORDER BY date DESC
      LIMIT 50
    `;

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
}