const fs = require('fs');

const data = JSON.parse(fs.readFileSync('extracted_strings.json'));
const en = data.en;
const tl = {};

const preciseMap = {
    "Dashboard": "Pangkalahatan",
    "Transactions": "Mga Transaksyon",
    "Wallets": "Mga Wallet",
    "Goals": "Mga Naipong Pera",
    "Kwarta AI": "Kwarta AI",
    "Settings": "Mga Tagpuan",
    "Income": "Kita",
    "Expense": "Gastos",
    "Transfer": "Lipat",
    "Total Balance": "Kabuuang Balanse",
    "Welcome Back!": "Maligayang Pagbabalik!",
    "Email Address": "Email Address",
    "Password": "Password",
    "LOG IN": "MAG-LOG IN",
    "Sign In": "Mag-sign In",
    "Create New Account": "Gumawa ng Bagong Account",
    "Sign Up": "Mag-sign Up",
    "Username": "Pangalan",
    "Confirm Password": "Kumpirmahin ang Password",
    "Create Account": "Gumawa ng Account",
    "Forgot Password?": "Nakalimutan ang Password?",
    "Amount": "Halaga",
    "Language": "Wika",
    "Dark Mode": "Madilim na Mode",
    "Description": "Paglalarawan",
    "Type": "Uri",
    "Cash": "Pera",
    "Bank Account": "Akaunt sa Bangko",
    "Other": "Iba pa",
    "Wallet Type": "Uri ng Wallet",
    "SAVE TRANSACTION": "I-SAVE ANG TRANSAKSYON",
    "Confirm Action": "Kumpirmahin ang Aksyon",
    "Are you sure you want to proceed?": "Sigurado ka bang gusto mong magpatuloy?",
    "Confirm": "Kumpirmahin",
    "Add Savings Goal": "Idagdag ang Layunin ng Naipon",
    "Target Amount": "Target na Halaga",
    "Target Date": "Target na Petsa",
    "SAVE GOAL": "I-SAVE ANG LAYUNIN",
    "Add Funds to Goal": "Magdagdag ng Pondo sa Layunin",
    "Amount to Add": "Halagang Idadagdag",
    "ADD FUNDS": "MAGDAGDAG NG PONDO",
    "Add Wallet": "Idagdag ang Wallet",
    "Wallet Name": "Pangalan ng Wallet",
    "Initial Balance": "Unang Balanse",
    "SAVE WALLET": "I-SAVE ANG WALLET",
    "Transfer Funds": "Maglipat ng Pondo",
    "From Wallet": "Mula sa Wallet",
    "To Wallet": "Papunta sa Wallet",
    "TRANSFER": "LIPAT",
    "Preferences": "Mga Kagustuhan",
    "APPEARANCE": "ANYO",
    "DATA MANAGEMENT": "PAMAMAHALA NG DATOS",
    "Export Data": "I-export ang Datos",
    "LEGAL": "LEGAL",
    "Privacy Policy": "Patakaran sa Privacy",
    "Terms of Use": "Mga Tuntunin sa Paggamit",
    "DANGER ZONE": "MAPANGANIB NA SONA",
    "Delete Account": "Tanggalin ang Account",
    "Account Details": "Mga Detalye ng Account",
    "Nickname": "Palayaw",
    "Phone Number": "Numero ng Telepono",
    "Bio / Goal": "Bio / Layunin",
    "Member Since": "Miyembro Mula Pa",
    "Edit Profile": "I-edit ang Profile",
    "Save Changes": "I-save ang Pagbabago",
    "Cancel": "Kanselahin",
    "LOG OUT": "MAG-LOG OUT",
    "Send Reset Link": "Ipadala ang Link sa Pag-reset",
    "ALL TIME": "LAHAT NG ORAS",
    "TODAY": "NGAYON",
    "MONTHLY": "BUWANAN",
    "WEEKLY": "LINGGUHAN",
    "YEARLY": "TAUNAN",
    "Search transactions...": "Maghanap ng mga transaksyon...",
    "All Types": "Lahat ng Uri",
    "All Wallets": "Lahat ng Wallet",
    "All Time": "Lahat ng Oras",
    "Today": "Ngayon",
    "Yesterday": "Kahapon",
    "This Week": "Ngayong Linggo",
    "This Month": "Ngayong Buwan",
    "Last 6 Months": "Nakaraang 6 na Buwan",
    "This Year": "Ngayong Taon",
    "TITLE": "TITULO",
    "AMOUNT": "HALAGA",
    "TYPE": "URI",
    "DATE": "PETSA",
    "WALLET": "WALLET",
    "Add New Wallet": "Magdagdag ng Bagong Wallet",
    "Add New Goal": "Magdagdag ng Bagong Layunin",
    "Smart Personal Finance": "Matalinong Pansariling Pananalapi"
};

for (const [k, v] of Object.entries(en)) {
    let trans = v;
    
    // Exact match 
    if (preciseMap[v.trim()]) {
        trans = preciseMap[v.trim()];
    } else {
        // Loose replace for multi strings
        for (const [eng, tag] of Object.entries(preciseMap)) {
            if(eng.length < 4) continue; // skip short
            const regex = new RegExp(`\\b${eng}\\b`, 'g');
            trans = trans.replace(regex, tag);
            
            // uppercase variant
            const regexU = new RegExp(`\\b${eng.toUpperCase()}\\b`, 'g');
            trans = trans.replace(regexU, tag.toUpperCase());
        }
    }
    
    tl[k] = trans;
}

const output = `window.bbmTranslations = {
    en: ${JSON.stringify(en, null, 4)},
    tl: ${JSON.stringify(tl, null, 4)}
};

window.getTranslation = function(key) {
    const lang = localStorage.getItem('bbm_language') || 'en';
    const dict = window.bbmTranslations[lang] || window.bbmTranslations['en'];
    return dict[key] || window.bbmTranslations['en'][key] || key;
};

window.applyTranslations = function() {
    const lang = localStorage.getItem('bbm_language') || 'en';
    const dict = window.bbmTranslations[lang] || window.bbmTranslations['en'];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        } else {
             if (dict[key]) el.innerHTML = dict[key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) el.placeholder = dict[key];
    });
};
`;

fs.writeFileSync('assets/js/i18n.js', output);
console.log("i18n.js successfully rewritten with exhaustive localized keys!");
