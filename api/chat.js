import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

const sql = neon(process.env.DATABASE_URL);
const AUTH_SECRET = process.env.AUTH_SECRET;

// Helper to decode/verify JWT token
function verifyToken(token) {
  try {
    if (!AUTH_SECRET) {
      // Fallback for unsigned locally encoded token
      const parts = token.split('.');
      if (parts.length === 1) {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
        return decoded;
      }
    }
    
    // Signed token
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
  
  // Verify user token
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
      // Get chat history
      const history = await sql`
        SELECT role, content, created_at
        FROM ai_chats
        WHERE acc_id = ${acc_id}
        ORDER BY chat_id ASC
      `;
      return res.status(200).json({ success: true, data: history });
      
    } else if (method === 'POST') {
      // Handle new message
      const { message } = req.body;
      if (!message || message.trim() === '') {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Save user message to database
      await sql`
        INSERT INTO ai_chats (acc_id, role, content)
        VALUES (${acc_id}, 'user', ${message})
      `;

      // Fetch history for context (limit to last 20 messages to save tokens)
      const history = await sql`
        SELECT role, content
        FROM ai_chats
        WHERE acc_id = ${acc_id}
        ORDER BY chat_id DESC
        LIMIT 20
      `;

      // Reverse history to chronological order
      const apiMessages = history.reverse().map(row => ({
        role: row.role,
        content: row.content
      }));

      // System Prompt
      const systemPrompt = {
        role: 'system',
        content: "You are Kwarta AI, a strict financial assistant bot. You must ONLY answer questions related to finance, budgeting, money management, investments, economics, or the user's transaction data. If the user asks about anything else, politely decline and steer the conversation back to finance. Be helpful, concise, and friendly."
      };

      // Call Deepseek API
      const apiKey = process.env.DEEPSEEK_API_KEY ? process.env.DEEPSEEK_API_KEY.replace(/^"|"$/g, '') : null;
      if (!apiKey) {
        return res.status(500).json({ error: 'DEEPSEEK_API_KEY is missing' });
      }

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [systemPrompt, ...apiMessages],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Deepseek API error:', errText);
        return res.status(502).json({ error: 'AI provider error' });
      }

      const data = await response.json();
      const aiReply = data.choices[0].message.content;

      // Save AI message to database
      await sql`
        INSERT INTO ai_chats (acc_id, role, content)
        VALUES (${acc_id}, 'assistant', ${aiReply})
      `;

      return res.status(200).json({
        success: true,
        reply: aiReply
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
