const fs = require('fs');
const https = require('https');
const steps = [388, 393, 397, 401, 404];
const names = ['transactions', 'wallets', 'goals', 'kwarta-ai', 'settings'];

steps.forEach((step, idx) => {
  try {
    const data = fs.readFileSync(`C:/Users/punza/.gemini/antigravity/brain/61302ea7-2024-4aa6-80f0-97d789d5a2ee/.system_generated/steps/${step}/output.txt`, 'utf8');
    const json = JSON.parse(data);
    const downloadUrl = json.outputComponents[0].design.screens[0].htmlCode.downloadUrl;
    
    https.get(downloadUrl, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        fs.writeFileSync(`e:/GitHub/bacarov2/.stitch/designs/${names[idx]}.html`, html);
        console.log(`Saved ${names[idx]}.html`);
      });
    });
  } catch(e) {
    console.error(`Error processing step ${step}:`, e.message);
  }
});
