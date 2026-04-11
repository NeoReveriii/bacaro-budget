const fs = require('fs');
const path = require('path');
const viewsDir = 'views';

const files = fs.readdirSync(viewsDir).filter(f => f.endsWith('.html'));

files.forEach(f => {
    const p = path.join(viewsDir, f);
    let c = fs.readFileSync(p, 'utf-8');
    
    // Inject i18n script
    if (!c.includes('i18n.js') && c.includes('<script src="/assets/js/main.js"></script>')) {
        c = c.replace('<script src="/assets/js/main.js"></script>', '<script src="/assets/js/i18n.js"></script>\n\t<script src="/assets/js/main.js"></script>');
    }
    
    fs.writeFileSync(p, c);
    console.log('Updated ' + f);
});
