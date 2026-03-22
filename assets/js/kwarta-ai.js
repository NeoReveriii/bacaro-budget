// assets/js/kwarta-ai.js

async function loadAIComponent() {
    const aiContainer = document.getElementById('kwarta-ai-interface');
    if (!aiContainer) return;

    try {
        const response = await fetch('/assets/components/kwarta-ai.html?v=3');
        let html = await response.text();
        
        // Dynamically inject user name
        const userData = typeof getUserData === 'function' ? getUserData() : null;
        const userName = userData ? userData.username : 'there';
        html = html.replace('{User}', userName);
        
        aiContainer.innerHTML = html;
        console.log("Kwarta AI: Component HTML Loaded");
        
        initAIListeners();
        loadChatHistory();
    } catch (err) {
        console.error("Kwarta AI: Failed to load component:", err);
    }
}

function appendMessage(role, content) {
    const list = document.getElementById('chat-messages');
    if (!list) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${role === 'user' ? 'user-msg' : 'ai-msg'}`;
    
    // Parse newlines as <br> for simple formatting
    const formattedContent = content.replace(/\n/g, '<br>');
    
    msgDiv.innerHTML = `
        <div class="msg-bubble">
            ${formattedContent}
        </div>
    `;
    list.appendChild(msgDiv);
    list.scrollTop = list.scrollHeight;
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
                // Clear default greeting if there is history
                const list = document.getElementById('chat-messages');
                if (list) list.innerHTML = '';
                
                json.data.forEach(msg => appendMessage(msg.role, msg.content));
            }
        }
    } catch (err) {
        console.error("Kwarta AI: Load history error:", err);
    }
}

async function handleSendMessage() {
    if (typeof isAuthenticated === 'function' && !isAuthenticated()) {
        showToast('Please log in first', 'error');
        return;
    }
    
    const input = document.querySelector('.chat-input-area input');
    const sendBtn = document.querySelector('.btn-send');
    if (!input || !sendBtn) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    // Clear input
    input.value = '';
    
    // Append user message immediately
    appendMessage('user', message);
    
    // Show loading
    sendBtn.disabled = true;
    sendBtn.innerHTML = '...';
    
    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ message })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            appendMessage('assistant', data.reply);
        } else {
            appendMessage('assistant', 'Error: ' + (data.error || 'Failed to get response'));
        }
    } catch (err) {
        console.error("Kwarta AI: Send message error:", err);
        appendMessage('assistant', 'Network error. Please try again.');
    } finally {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '➤';
    }
}

function initAIListeners() {
    const sendBtn = document.querySelector('.btn-send');
    const input = document.querySelector('.chat-input-area input');
    
    if (sendBtn) {
        sendBtn.addEventListener('click', handleSendMessage);
    }
    
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSendMessage();
        });
    }
    
    // Prompt Chips
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

// Auto-load when this script is imported
document.addEventListener('DOMContentLoaded', loadAIComponent);