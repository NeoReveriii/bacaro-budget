const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const crypto = require('crypto');

const viewsDir = path.join(__dirname, 'views');
const htmlFiles = fs.readdirSync(viewsDir).filter(f => f.endsWith('.html'));

const dictionary = {};

function slugify(text) {
    let t = text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    return t.substring(0, 30);
}

const ignoredTags = ['SCRIPT', 'STYLE', 'SVG', 'PATH', 'POLYLINE', 'CIRCLE', 'HEAD', 'TITLE', 'META', 'LINK'];

function processNode(node, doc) {
    if (node.nodeType === 3) { // Text Node
        const text = node.nodeValue.trim();
        // Ignore single characters or empty
        if (text.length > 1 && !/^\d+$/.test(text) && !/^[^\w]+$/.test(text)) {
            // Found a valid string to translate
            // check if parent already has data-i18n
            let parent = node.parentNode;
            if (parent && parent.getAttribute && parent.getAttribute('data-i18n')) {
                // already localized
                dictionary[parent.getAttribute('data-i18n')] = text;
            } else if (parent && parent.childNodes.length === 1) {
                // Parent only contains this text
                let hash = 'str_' + crypto.createHash('md5').update(text).digest('hex').substring(0,8);
                parent.setAttribute('data-i18n', hash);
                dictionary[hash] = text;
            } else {
                // Parent has mixed content (e.g. text + icons)
                let hash = 'str_' + crypto.createHash('md5').update(text).digest('hex').substring(0,8);
                let span = doc.createElement('span');
                span.setAttribute('data-i18n', hash);
                span.textContent = text;
                node.parentNode.replaceChild(span, node);
                dictionary[hash] = text;
            }
        }
    } else if (node.nodeType === 1) { // Element Node
        if (ignoredTags.includes(node.tagName)) return;
        
        // Handle placeholders
        if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
            const ph = node.getAttribute('placeholder');
            if (ph && ph.trim().length > 1 && ph !== ' ') {
                let hash = 'str_' + crypto.createHash('md5').update(ph).digest('hex').substring(0,8);
                node.setAttribute('data-i18n-placeholder', hash);
                dictionary[hash] = ph;
            }
        }

        // Clone children list to avoid issues when replacing text nodes with spans
        const children = Array.from(node.childNodes);
        children.forEach(child => processNode(child, doc));
    }
}

htmlFiles.forEach(file => {
    const filePath = path.join(viewsDir, file);
    const html = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    
    processNode(doc.body, doc);
    
    // Inject script if missing
    let finalHtml = dom.serialize();
    if (!finalHtml.includes('/assets/js/i18n.js') && finalHtml.includes('/assets/js/main.js')) {
        finalHtml = finalHtml.replace('<script src="/assets/js/main.js', '<script src="/assets/js/i18n.js"></script>\n\t<script src="/assets/js/main.js');
    }

    fs.writeFileSync(filePath, finalHtml);
    console.log(`Processed ${file}`);
});

fs.writeFileSync('extracted_strings.json', JSON.stringify({ en: dictionary }, null, 2));
console.log('Dictionaries exported to extracted_strings.json');
