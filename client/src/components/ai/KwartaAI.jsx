import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, RefreshCw } from 'lucide-react';
import { apiGetChat, apiSendChat, apiClearChat } from '../../lib/api';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { marked } from 'marked';

function processContent(content) {
  const raw = content.replace(/\[CHART.*?\]/g, '');
  return marked.parse(raw);
}

export default function KwartaAI() {
  const { showToast, showConfirm } = useApp();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const listRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (autoScroll && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, autoScroll]);

  const loadHistory = async () => {
    try {
      const data = await apiGetChat();
      if (data?.length > 0) setMessages(data.map(m => ({ role: m.role, content: m.content })));
    } catch { /* no-op */ }
  };

  const handleScroll = () => {
    if (!listRef.current) return;
    const { scrollHeight, scrollTop, clientHeight } = listRef.current;
    setAutoScroll(scrollHeight - scrollTop <= clientHeight + 10);
  };

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    const placeholderIdx = messages.length + 1;
    setMessages(prev => [...prev, { role: 'assistant', content: '', _loading: true }]);

    try {
      const res = await apiSendChat(msg);
      if (!res.ok) throw new Error('API Error');
      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const parsed = JSON.parse(line.slice(6));
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                accumulated += delta;
                setMessages(prev => {
                  const updated = [...prev];
                  const lastIdx = updated.findLastIndex(m => m._loading);
                  if (lastIdx >= 0) updated[lastIdx] = { role: 'assistant', content: accumulated, _loading: true };
                  return updated;
                });
              }
            } catch { /* skip bad chunks */ }
          }
        }
      }

      setMessages(prev => {
        const updated = [...prev];
        const lastIdx = updated.findLastIndex(m => m._loading);
        if (lastIdx >= 0) updated[lastIdx] = { role: 'assistant', content: accumulated, _loading: false };
        return updated;
      });
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        const lastIdx = updated.findLastIndex(m => m._loading);
        if (lastIdx >= 0) updated[lastIdx] = { role: 'assistant', content: 'Network error. Please try again.', _loading: false };
        return updated;
      });
    } finally { setLoading(false); }
  };

  const handleClear = () => {
    showConfirm('Clear Chat', 'Are you sure you want to clear your entire chat history?', async () => {
      await apiClearChat();
      setMessages([]);
    });
  };

  const CHIPS = ['How much did I spend this month?', 'Show income this week', 'What is my biggest expense?'];

  return (
    <main id="view-ai" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="ai-topbar">
        <h2 className="ai-title">Kwarta<span className="ai-title-ai"> AI</span></h2>
        <div className="ai-topbar-actions">
          <button className="icon-btn" id="btn-clear-chat" title="Clear Chat" onClick={handleClear}><Trash2 size={18} /></button>
        </div>
      </div>

      <div className="chat-messages" id="chat-messages" ref={listRef} onScroll={handleScroll}>
        {messages.length === 0 && (
          <div className="msg ai-msg">
            <div className="msg-bubble">
              Hello, <strong>{user?.username || 'there'}</strong>! I&apos;m Kwarta AI, your personal finance assistant. How can I help you today?
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role === 'user' ? 'user-msg' : 'ai-msg'}`}>
            {m._loading && !m.content ? (
              <div className="msg-bubble stream-target">
                <div className="typing-indicator">
                  <div className="typing-dot"></div><div className="typing-dot"></div><div className="typing-dot"></div>
                </div>
              </div>
            ) : (
              <div className="msg-bubble" dangerouslySetInnerHTML={{ __html: processContent(m.content) }} />
            )}
          </div>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="prompt-chips">
          {CHIPS.map(c => (
            <button key={c} className="chip" onClick={() => { setInput(c); }}>{c}</button>
          ))}
        </div>
      )}

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Ask Kwarta AI..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button className="btn-send" onClick={handleSend} disabled={loading || !input.trim()}>
          <Send size={18} />
        </button>
      </div>
    </main>
  );
}
