import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

const sql = neon(process.env.DATABASE_URL);
const AUTH_SECRET = process.env.AUTH_SECRET;

// Helper to decode/verify JWT token
function verifyToken(token) {
  try {
    if (!AUTH_SECRET) {
      const parts = token.split('.');
      if (parts.length === 1) {
        return JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      }
    }
    const [body, sig] = token.split('.');
    if (!body || !sig) return null;
    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(body).digest('hex');
    if (sig !== expectedSig) return null;
    return JSON.parse(Buffer.from(body, 'base64').toString('utf-8'));
  } catch (err) {
    return null;
  }
}

export default async function handler(req, res) {
  const { method } = req;
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  const user = verifyToken(token);
  if (!user || (!user.acc_id && !user.id)) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  const acc_id = user.acc_id || user.id;

  try {
    if (method === 'GET') {
      const history = await sql`
        SELECT role, content, created_at
        FROM ai_chats
        WHERE acc_id = ${acc_id}
        ORDER BY chat_id ASC
      `;
      return res.status(200).json({ success: true, data: history });
      
    } else if (method === 'DELETE') {
      await sql`DELETE FROM ai_chats WHERE acc_id = ${acc_id}`;
      return res.status(200).json({ success: true, message: 'Chat cleared' });

    } else if (method === 'POST') {
      const { message } = req.body;
      if (!message || message.trim() === '') {
        return res.status(400).json({ error: 'Message is required' });
      }

      await sql`
        INSERT INTO ai_chats (acc_id, role, content)
        VALUES (${acc_id}, 'user', ${message})
      `;

      // Fetch user's recent transactions for better context
      let transactionsText = "No recent transactions found.";
      try {
        const trans = await sql`
          SELECT type, amount, description, wallet_type, dateoftrans 
          FROM transactions 
          WHERE account_id = ${acc_id} 
          ORDER BY dateoftrans DESC 
          LIMIT 30
        `;
        if (trans.length > 0) {
          transactionsText = JSON.stringify(trans.map(t => ({
            date: t.dateoftrans,
            type: t.type,
            amount: t.amount,
            desc: t.description,
            wallet: t.wallet_type
          })));
        }
      } catch(e) { /* Ignore trans errors if table doesn't exist yet */ }

      // System Prompt
      const systemPrompt = {
        role: 'system',
        content: `You are Kwarta AI, a strict financial assistant bot. You must ONLY answer questions related to finance, budgeting, money management, investments, economics, or the user's transaction data. If the user asks about anything else, politely decline and steer the conversation back to finance. Be helpful, concise, and friendly. You MUST use Markdown for formatting (lists, bolding, etc.).

Here is the user's REAL-TIME transaction data right now:
${transactionsText}

CRITICAL DATA OVERRIDE: 
Users can edit or delete their transactions at any time. Therefore, ALWAYS base your calculations, summaries, and answers STRICTLY on the JSON real-time transaction data provided above. Do NOT rely on older chat history for transaction totals or data, because the older chat messages might be outdated. Always recalculate your answers using ONLY the exact JSON above as your source of truth!

IMPORTANT INSTRUCTION FOR UI VISUALS:
If the user explicitly asks for a visual summary, graph, chart, or visual breakdown of their expenses/spending, you must include the exact string: "[CHART]" at the very end of your response. This will trigger the UI to render a beautiful Pie Chart. Only use it when a visual graph makes sense.`
      };

      // Fetch history for context
      const history = await sql`
        SELECT role, content
        FROM ai_chats
        WHERE acc_id = ${acc_id}
        ORDER BY chat_id DESC
        LIMIT 15
      `;
      const apiMessages = history.reverse().map(row => ({
        role: row.role,
        content: row.content
      }));

      const apiKey = process.env.DEEPSEEK_API_KEY ? process.env.DEEPSEEK_API_KEY.replace(/^"|"$/g, '') : null;
      if (!apiKey) return res.status(500).json({ error: 'API key missing' });

      // Call API with STREAMING enabled
      const fetchRes = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [systemPrompt, ...apiMessages],
          temperature: 0.7,
          stream: true
        })
      });

      if (!fetchRes.ok) {
        return res.status(502).json({ error: 'AI provider error' });
      }

      // Stream the response back via SSE
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive'
      });

      const reader = fetchRes.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunkStr = decoder.decode(value, { stream: true });
        res.write(chunkStr);

        // Parse chunks to save to DB
        const lines = chunkStr.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.choices[0].delta.content) {
                fullResponse += parsed.choices[0].delta.content;
              }
            } catch(e) {}
          }
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();

      // Save complete AI message to database
      if (fullResponse) {
        await sql`
          INSERT INTO ai_chats (acc_id, role, content)
          VALUES (${acc_id}, 'assistant', ${fullResponse})
        `;
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Chat error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
}
