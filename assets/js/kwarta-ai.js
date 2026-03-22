// assets/js/kwarta-ai.js

let chatHistoryLoaded = false;
let autoScrollEnabled = true;

async function loadAIComponent() {
    const aiContainer = document.getElementById('kwarta-ai-interface');
    if (!aiContainer) return;

    try {
        const response = await fetch('/assets/components/kwarta-ai.html?v=4');
        let html = await response.text();
        
        const userData = typeof getUserData === 'function' ? getUserData() : null;
        const userName = userData ? userData.username : 'there';
        html = html.replace('{User}', userName);
        
        aiContainer.innerHTML = html;
        console.log("Kwarta AI: Component HTML Loaded");
        
        initAIListeners();
        loadChatHistory();
        
        // Custom auto-scroll listener
        const chatList = document.getElementById('chat-messages');
        if (chatList) {
            chatList.addEventListener('scroll', () => {
                const isAtBottom = chatList.scrollHeight - chatList.scrollTop <= chatList.clientHeight + 10;
                autoScrollEnabled = isAtBottom;
            });
        }
    } catch (err) {
        console.error("Kwarta AI: Failed to load component:", err);
    }
}

function processAndRenderContent(content) {
    // Check for chart trigger dynamically
    let finalHtml = "";
    
    let chartType = null;
    if (content.includes('[CHART:INCOME]')) chartType = 'income';
    else if (content.includes('[CHART:EXPENSE]')) chartType = 'expense';
    else if (content.includes('[CHART]')) chartType = 'expense';
    
    const rawContent = content.replace(/\[CHART.*?\]/g, ''); // Remove the tag
    
    // Parse markdown (assuming marked is loaded in dashboard.html)
    if (typeof marked !== 'undefined') {
        finalHtml = marked.parse(rawContent);
    } else {
        finalHtml = rawContent.replace(/\n/g, '<br>');
    }

    if (chartType) {
        // Append a canvas element and trigger the chart render logic
        const chartId = 'chart-' + Date.now() + Math.floor(Math.random() * 1000);
        finalHtml += `
            <div class="chart-container" style="position: relative; height: 220px; width: 100%; box-sizing: border-box; margin-top: 15px;">
                <canvas id="${chartId}"></canvas>
            </div>
        `;
        setTimeout(() => renderChatChart(chartId, chartType), 100);
    }
    
    return finalHtml;
}

function appendMessage(role, content, isEmptyStreamTarget = false) {
    const list = document.getElementById('chat-messages');
    if (!list) return null;

    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${role === 'user' ? 'user-msg' : 'ai-msg'}`;
    
    let innerContent = "";
    if (isEmptyStreamTarget) {
        innerContent = '<div class="msg-bubble stream-target loading-indicator"><span style="opacity:0.5; font-style:italic;">thinking...</span></div>';
    } else {
        innerContent = `<div class="msg-bubble">${processAndRenderContent(content)}</div>`;
    }
    
    msgDiv.innerHTML = innerContent;
    list.appendChild(msgDiv);
    
    if (autoScrollEnabled) list.scrollTop = list.scrollHeight;
    
    return msgDiv;
}

async function renderChatChart(canvasId, typeToGraph = 'expense') {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;
    
    // Fetch transaction data over the last 30 days
    try {
        const res = await fetch('/api/transactions', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const payload = await res.json();
        const data = Array.isArray(payload) ? payload : (payload.data || []);
        
        let filteredData = data.filter(t => t.type.toLowerCase() === typeToGraph.toLowerCase());
        
        if (filteredData.length === 0) {
            const ctx = canvas.getContext('2d');
            ctx.font = '12px Arial';
            ctx.fillStyle = '#999';
            ctx.textAlign = 'center';
            ctx.fillText(`No recent ${typeToGraph} data to plot`, canvas.width/2, canvas.height/2);
            return;
        }

        // Group by title/desc (simple categorizing fallback)
        const categories = {};
        filteredData.forEach(e => {
            const label = e.description || 'Other';
            categories[label] = (categories[label] || 0) + Number(e.amount);
        });
        
        const labels = Object.keys(categories);
        const amounts = Object.values(categories);
        
        new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: amounts,
                    backgroundColor: ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe', '#fab1a0'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { font: { size: 10 } } }
                }
            }
        });
    } catch(err) {
        console.error("Failed to render chart:", err);
    }
}

async function loadChatHistory() {
    if (typeof isAuthenticated === 'function' && !isAuthenticated()) return;
    
    try {
        const res = await fetch('/api/chat', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (res.ok) {
            const json = await res.json();
            if (json.data && json.data.length > 0) {
                const list = document.getElementById('chat-messages');
                if (list) list.innerHTML = ''; // clear default greeting
                
                json.data.forEach(msg => appendMessage(msg.role, msg.content));
            }
        }
    } catch (err) {
        console.error("Kwarta AI: Load history error:", err);
    }
}

async function clearChatHistory() {
    if (typeof showConfirm !== 'undefined') {
        showConfirm('Clear Chat', 'Are you sure you want to clear your entire chat history?', async () => {
            await executeClearChat();
        });
    } else {
        if (!confirm('Are you sure you want to clear your chat history?')) return;
        await executeClearChat();
    }
}

async function executeClearChat() {
    try {
        const res = await fetch('/api/chat', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (res.ok) {
            const list = document.getElementById('chat-messages');
            if (list) list.innerHTML = '';
            appendMessage('assistant', "Chat history cleared. How can I help you today?");
        }
    } catch(err) {
        console.error("Clear chat error:", err);
    }
}

async function handleSendMessage() {
    if (typeof isAuthenticated === 'function' && !isAuthenticated()) {
        if(typeof showToast === 'function') showToast('Please log in first', 'error');
        return;
    }
    
    const input = document.querySelector('.chat-input-area input');
    const sendBtn = document.querySelector('.btn-send');
    if (!input || !sendBtn) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    // Clear input & append user message
    input.value = '';
    appendMessage('user', message);
    
    // Disable send btn
    sendBtn.disabled = true;
    sendBtn.innerHTML = '...';
    
    // Placeholder stream target
    const targetMsg = appendMessage('assistant', '', true);
    const bubble = targetMsg.querySelector('.stream-target');
    let accumulatedText = "";
    
    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ message })
        });
        
        if (!res.ok) throw new Error("API Error");
        
        // Read SSE stream
        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        
        bubble.innerHTML = ''; // remove "thinking..."
        bubble.classList.remove('loading-indicator');
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                    try {
                        const parsed = JSON.parse(line.slice(6));
                        if (parsed.choices[0].delta.content) {
                            accumulatedText += parsed.choices[0].delta.content;
                            // Re-render parsed markdown continuously
                            bubble.innerHTML = processAndRenderContent(accumulatedText);
                            if (autoScrollEnabled) {
                                const list = document.getElementById('chat-messages');
                                list.scrollTop = list.scrollHeight;
                            }
                        }
                    } catch(e) {}
                }
            }
        }
    } catch (err) {
        console.error("Kwarta AI: Stream message error:", err);
        bubble.innerHTML = 'Network error. Please try again.';
    } finally {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '➤';
    }
}

function initAIListeners() {
    const sendBtn = document.querySelector('.btn-send');
    const input = document.querySelector('.chat-input-area input');
    const clearBtn = document.getElementById('btn-clear-chat');
    
    if (sendBtn) sendBtn.addEventListener('click', handleSendMessage);
    if (clearBtn) clearBtn.addEventListener('click', clearChatHistory);
    
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSendMessage();
        });
    }
    
    const chips = document.querySelectorAll('.prompt-chips .chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            if (input) {
                input.value = chip.textContent;
                handleSendMessage();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', loadAIComponent);