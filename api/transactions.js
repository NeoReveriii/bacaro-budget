import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      // Get all transactions
      const rows = await sql`
        SELECT *
        FROM transactions
        ORDER BY date DESC
        LIMIT 50
      `;
      res.status(200).json(rows);

    } else if (method === 'POST') {
      // Add a new transaction
      const { title, amount, type, wallet } = req.body;
      if (!title || !amount || !type) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const inserted = await sql`
        INSERT INTO transactions (title, amount, type, wallet)
        VALUES (${title}, ${amount}, ${type}, ${wallet})
        RETURNING *
      `;
      res.status(201).json(inserted);

    } else if (method === 'PUT') {
      // Update a transaction
      const { id, title, amount, type, wallet } = req.body;
      if (!id) return res.status(400).json({ error: 'Transaction ID required' });

      const updated = await sql`
        UPDATE transactions
        SET title = COALESCE(${title}, title),
            amount = COALESCE(${amount}, amount),
            type = COALESCE(${type}, type),
            wallet = COALESCE(${wallet}, wallet)
        WHERE id = ${id}
        RETURNING *
      `;
      res.status(200).json(updated);

    } else if (method === 'DELETE') {
      // Delete a transaction
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'Transaction ID required' });

      const deleted = await sql`
        DELETE FROM transactions
        WHERE id = ${id}
        RETURNING *
      `;
      res.status(200).json(deleted);

    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
}
