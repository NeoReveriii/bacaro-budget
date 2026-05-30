const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:/Users/punza/.gemini/antigravity-ide/brain/9180cedc-7fe7-456e-824f-7d999d4e174d/.system_generated/steps/450/output.txt', 'utf8'));
data.outputComponents[0].design.screens.forEach((s, i) => {
  console.log(`Choice ${i+1}:`);
  console.log(`Title: ${s.title}`);
  console.log(`Image: ${s.screenshot.downloadUrl}`);
  console.log(`HTML: ${s.htmlCode.downloadUrl}`);
  console.log('---');
});
