const fs = require('fs');
const content = fs.readFileSync('assets/css/dashboard.css', 'utf8');
const lines = content.split('\n');
let balance = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const char of line) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
    if (balance < 0) {
        console.log(`Balance went negative at line ${i + 1}: balance is ${balance}`);
        console.log(`Line content: ${line}`);
        // We might want to stop or continue to find all points of failure
        balance = 0; // Reset to find next one
    }
}
console.log(`Final balance is: ${balance}`);
if (balance !== 0) {
    console.log(`Missing ${Math.abs(balance)} ${balance > 0 ? 'closing' : 'opening'} braces.`);
}
