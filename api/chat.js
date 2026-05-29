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
        console.log('Chat API: Fetching transactions for account_id:', acc_id);
        const trans = await sql`
          SELECT type, amount, description, wallet_type, dateoftrans 
          FROM transactions 
          WHERE account_id = ${acc_id} 
          ORDER BY dateoftrans DESC 
          LIMIT 30
        `;
        console.log('Chat API: Found', trans.length, 'transactions');
        if (trans.length > 0) {
          transactionsText = JSON.stringify(trans.map(t => ({
            date: t.dateoftrans,
            type: t.type,
            amount: t.amount,
            desc: t.description,
            wallet: t.wallet_type
          })));
          console.log('Chat API: Transaction context:', transactionsText.substring(0, 200));
        }
      } catch(e) {
        console.error('Chat API: ERROR fetching transactions:', e.message);
      }

      // Fetch user's wallets with calculated balances for accurate context
      let walletsText = "No wallets found.";
      try {
        const wallets = await sql`
          SELECT 
            w.name, 
            w.type, 
            w.initial_balance, 
            w.status,
            (
              w.initial_balance + 
              COALESCE(SUM(CASE 
                WHEN t.type = 'Income' AND t.wallet_id = w.wallet_id THEN t.amount 
                WHEN t.type = 'Transfer' AND t.transfer_to_wallet_id = w.wallet_id THEN t.amount
                WHEN t.type = 'Transfer'
                  AND t.transfer_to_wallet_id IS NULL
                  AND t.wallet_id = w.wallet_id
                  AND (t.description ILIKE 'Transfer from%' OR t.description ILIKE 'Transfer In from%')
                THEN t.amount
                ELSE 0 END), 0) - 
              COALESCE(SUM(CASE 
                WHEN t.type = 'Expense' AND t.wallet_id = w.wallet_id THEN t.amount 
                WHEN t.type = 'Transfer' AND t.transfer_from_wallet_id = w.wallet_id THEN t.amount
                WHEN t.type = 'Transfer'
                  AND t.transfer_from_wallet_id IS NULL
                  AND t.wallet_id = w.wallet_id
                  AND (t.description ILIKE 'Transfer to%' OR t.description ILIKE 'Transfer Out to%')
                THEN t.amount
                ELSE 0 END), 0)
            ) as current_balance
          FROM wallets w
          LEFT JOIN transactions t 
            ON t.account_id = w.account_id
          WHERE w.account_id = ${acc_id}
          GROUP BY w.wallet_id
          ORDER BY w.created_at ASC
        `;
        console.log('Chat API: Found', wallets.length, 'wallets');
        if (wallets.length > 0) {
          walletsText = JSON.stringify(wallets.map(w => ({
            name: w.name,
            type: w.type,
            initial_balance: w.initial_balance,
            current_balance: w.current_balance,
            status: w.status
          })));
        }
      } catch(e) {
        console.error('Chat API: ERROR fetching wallets:', e.message);
      }

      // Fetch user's savings goals for context
      let goalsText = "No savings goals found.";
      try {
        const goals = await sql`
          SELECT title, target_amount, current_amount, deadline, category, priority
          FROM goals
          WHERE account_id = ${acc_id}
          ORDER BY created_at DESC
        `;
        console.log('Chat API: Found', goals.length, 'goals');
        if (goals.length > 0) {
          goalsText = JSON.stringify(goals.map(g => ({
            title: g.title,
            target: g.target_amount,
            saved: g.current_amount,
            progress: g.target_amount > 0 ? ((g.current_amount / g.target_amount) * 100).toFixed(1) + '%' : '0%',
            deadline: g.deadline,
            category: g.category,
            priority: g.priority
          })));
        }
      } catch(e) {
        console.error('Chat API: ERROR fetching goals:', e.message);
      }

      // System Prompt
      const systemPrompt = {
        role: 'system',
        content: `You are Kwarta AI, a strict financial assistant bot. You must ONLY answer questions related to finance, budgeting, money management, investments, economics, or the user's transaction data. If the user asks about anything else, politely decline and steer the conversation back to finance. Be helpful, concise, and friendly. You MUST use Markdown for formatting (lists, bolding, etc.).

Here is the user's REAL-TIME wallet data (this is the AUTHORITATIVE source for balances):
${walletsText}

IMPORTANT: Each wallet has an "initial_balance" (the starting amount when created) and a "current_balance" (initial + all income/transfers in - all expenses/transfers out). When the user asks "what is my balance for X wallet?", ALWAYS use the "current_balance" field from the wallet data above. Do NOT try to manually calculate it from transactions — the current_balance already includes the initial balance and all transactions.

Here is the user's REAL-TIME transaction data (recent activity):
${transactionsText}

CRITICAL DATA OVERRIDE: 
Users frequently edit, delete, or wipe their transactions. ALWAYS base your calculations strictly on the JSON data provided above. 
If the data above says "No recent transactions found.", it means the user has DELETED everything. You MUST proudly state that they have ZERO transactions and ZERO expenses/income. You are FORBIDDEN from quoting, repeating, or remembering any numbers, totals, or data from previous chat history messages. The chat history is a lie if it conflicts with the JSON data above.

IMPORTANT INSTRUCTION FOR UI VISUALS:
If the user explicitly asks for a visual summary, graph, chart, or visual breakdown:
- If they ask about Income, output exactly "[CHART:INCOME]" at the very end of your response.
- If they ask about Expenses, output exactly "[CHART:EXPENSE]" at the very end of your response.
- If they ask for a general summary without specifying, default to outputting "[CHART:EXPENSE]".

Here is the user's SAVINGS GOALS data (SECONDARY context — only use when goals are explicitly asked about):
${goalsText}

QUERY TYPE ROUTING — follow these rules strictly:
1. "Monthly Summary" or "summary" → Focus ONLY on TRANSACTION data: total income, total expenses, net cash flow, spending categories, and wallet balances. Do NOT talk about savings goals unless the user specifically mentions them.
2. "Top Expense" or "expenses" → Analyze TRANSACTION data to find the biggest expense categories and amounts.
3. "Recent Transactions" → List recent transactions from the transaction data.
4. "Wallet Breakdown" → Show wallet balances and transaction activity per wallet.
5. "Budget Advice" or "Savings Tips" → Give general budgeting advice. You may briefly reference goals if relevant, but focus on transaction patterns.
6. "My goals" or "goals" or "savings goals" → ONLY THEN provide a detailed goals breakdown with progress, deadlines, and savings advice.
7. Any other finance question → Use the most relevant data source (transactions, wallets, or goals) based on context.`
      };

      const apiKey = process.env.DEEPSEEK_API_KEY ? process.env.DEEPSEEK_API_KEY.replace(/^"|"$/g, '') : null;
      if (!apiKey) return res.status(500).json({ error: 'API key missing' });

      // Send ONLY the system prompt + current message to the AI.
      // History is intentionally excluded because:
      // 1. The system prompt already contains all real-time financial data
      // 2. Including previous user messages caused the AI to respond to old queries
      const apiMessages = [{ role: 'user', content: message }];

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
