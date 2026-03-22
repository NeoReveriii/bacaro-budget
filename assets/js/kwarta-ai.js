// assets/js/kwarta-ai.js

async function loadAIComponent() {
    const aiContainer = document.getElementById('kwarta-ai-interface');
    if (!aiContainer) return;

    try {
        const response = await fetch('/assets/components/kwarta-ai.html');
        const html = await response.text();
        aiContainer.innerHTML = html;
        console.log("Kwarta AI: Component HTML Loaded");
        
        // After loading the HTML, initialize AI button listeners here
        initAIListeners(); 
    } catch (err) {
        console.error("Kwarta AI: Failed to load component:", err);
    }
}

function initAIListeners() {
    const sendBtn = document.querySelector('.btn-send');
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            console.log("Kwarta AI: Send button clicked!");
            // Your teammate's AI logic goes here
        });
    }
}

// Auto-load when this script is imported
document.addEventListener('DOMContentLoaded', loadAIComponent);