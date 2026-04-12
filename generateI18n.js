const fs = require('fs');

const data = JSON.parse(fs.readFileSync('extracted_strings.json'));
const en = data.en;
const tl = {};

const preciseMap = {
    "Dashboard": "Pangkalahatan",
    "Transactions": "Mga Transaksyon",
    "Wallets": "Mga Wallet",
    "Goals": "Layunin",
    "Kwarta AI": "Kwarta AI",
    "Settings": "Mga Settings",
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
    "Dark Mode": "Dark Mode",
    "Switch between standard and low-light interface themes.": "Magpalit sa pagitan ng standard at low-light na interface themes",
    "Contrast Adjustment": "Pag-aayos ng Contrast",
    "Toggle between normal and high contrast modes.": "Magpalit sa pagitan ng normal at high contrast na modes.",
    "Normal Contrast": "Normal na Contrast",
    "High Contrast": "Mataas na Contrast",
    "Currency Display": "Pagpapakita ng Currency",
    "Select your preferred display language.": "Pumili ng iyong nais na wika para sa display.",
    "Show or hide the Pesos symbol (₱) in amounts.": "Ipakita o itago ang simbolo ng Piso (₱) sa mga halaga.",
    "Download a CSV file containing all your transaction records.": "Mag-download ng CSV file na naglalaman ng lahat ng iyong mga rekord ng transaksyon.",
    "Read how we handle and protect your budget data.": "Basahin kung paano namin pinangangalagaan at pinoprotektahan ang iyong datos sa badyet.",
    "Review the rules and guidelines for using Bacaro.": "Suriin ang mga patakaran at gabay sa paggamit ng Bacaro.",
    "Permanently remove your account and all associated budget data.": "Permanenteng tanggalin ang iyong account at lahat ng nauugnay na datos ng badyet.",
    "New Transaction": "Bagong Transaksyon",
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
    "ALL TIME": "KABUUAN",
    "TODAY": "NGAYONG ARAW",
    "MONTHLY": "BUWANAN",
    "WEEKLY": "LINGGUHAN",
    "YEARLY": "TAUNAN",
    "Search transactions...": "Maghanap ng mga transaksyon...",
    "All Types": "Lahat ng Uri",
    "All Wallets": "Lahat ng Wallet",
    "All Time": "Kabuuan",
    "Today": "Ngayong Araw",
    "Yesterday": "Kahapon",
    "This Week": "Ngayong Linggo",
    "This Month": "Ngayong Buwan",
    "Last 6 Months": "Nakaraang 6 na Buwan",
    "This Year": "Ngayong Taon",
    "TITLE": "Pamagat",
    "AMOUNT": "HALAGA",
    "TYPE": "URI",
    "DATE": "PETSA",
    "WALLET": "WALLET",
    "Add New Wallet": "Magdagdag ng Bagong Wallet",
    "Add New Goal": "Magdagdag ng Bagong Layunin",
    "Goal Title (e.g., Emergency Fund)": "Pamagat ng Layunin (hal. Emergency Fund)",
    "Smart Personal Finance": "Matalinong Pansariling Pananalapi",
    "Confirm Action": "Kumpirmahin ang Aksyon",
    "Are you sure you want to proceed?": "Sigurado ka bang gusto mong magpatuloy?",
    "Confirm": "Kumpirmahin",
    "Add Savings Goal": "Magdagdag ng Savings Goal",
    "Recent Transactions": "Mga Nakaraang Transaksyon",
    "Description": "Detalye",
    "Add Funds to Goal": "Magpasok ng Pondo",
    "Add Funds": "Magpasok ng Pondo",
    "Target Date": "Target na Petsa",
    "No savings goals found. Add one to start tracking your progress.": "Walang nakitang mga layunin sa pag-ipon. Magdagdag ng isa upang simulan ang pagsubaybay sa iyong progreso.",
    "ADD FUNDS": "MAGPASOK NG PONDO",
    "Your Balance": "Iyong Balanse",
    "Cash Flow Trend": "Daloy ng Pera"
};

for (const [k, v] of Object.entries(en)) {
    let trans = v;
    const normV = v.replace(/\s+/g, ' ').trim();

    // Exact match 
    if (preciseMap[normV]) {
        trans = preciseMap[normV];
    } else if (preciseMap[v.trim()]) {
        trans = preciseMap[v.trim()];
    } else {
        // Loose replace for multi strings
        for (const [eng, tag] of Object.entries(preciseMap)) {
            if (eng.length < 4) continue; // skip short
            const regex = new RegExp(`\\b${eng}\\b`, 'gi');
            trans = trans.replace(regex, (matched) => {
                return matched === matched.toUpperCase() ? tag.toUpperCase() : tag;
            });
        }
    }

    // Special case for the "ALL ... WALLET" multi-line issue
    if (trans.toUpperCase().includes('ALL') && trans.toUpperCase().includes('WALLET')) {
        trans = "Lahat ng Wallet";
    }

    tl[k] = trans;
}

// Add manual keys for JS-based lookups
const manualKeys = {
    "toast_saved": { en: "Saved", tl: "Na-save" },
    "toast_success": { en: "Success", tl: "Tagumpay" },
    "toast_error": { en: "Error", tl: "Mali" },
    "toast_profile_updated": { en: "Profile Updated successfully", tl: "Matagumpay na na-update ang profile" },
    "toast_transaction_deleted": { en: "Transaction deleted!", tl: "Tinanggal ang transaksyon!" },
    "Normal Contrast": { en: "Normal Contrast", tl: "Normal na Contrast" },
    "High Contrast": { en: "High Contrast", tl: "Mataas na Contrast" }
};

for (const [key, val] of Object.entries(manualKeys)) {
    en[key] = val.en;
    tl[key] = val.tl;
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
