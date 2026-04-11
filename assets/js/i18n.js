window.bbmTranslations = {
    en: {
        // Dashboard Nav
        "nav_dashboard": "Overview",
        "nav_transactions": "Transactions",
        "nav_wallets": "Wallets",
        "nav_ai": "Kwarta AI",
        "nav_goals": "Savings Goals",
        "nav_settings": "Settings",

        // Overview
        "summary_income": "Income",
        "summary_expense": "Expense",
        "summary_transfer": "Transfer",

        // Modals / Common
        "btn_save": "SAVE",
        "btn_cancel": "Cancel",
        "btn_add": "Add",
        "btn_delete": "Delete",
        "btn_edit": "Edit",

        // Toasts / Messages
        "toast_saved": "Saved",
        "toast_success": "Success",
        "toast_error": "Error",
        "toast_profile_updated": "Profile Updated successfully",
        "toast_please_select_image": "Please select an image file",
        "toast_image_uploaded": "Image uploaded and cropped!",
        "toast_no_transactions_export": "No transactions to export",
        "toast_export_successful": "Export successful!",
        "toast_signin_to_delete": "Sign in to delete your account",
        "toast_unable_identify_account": "Unable to identify account",
        "toast_transaction_deleted": "Transaction deleted!",
        
        "confirm_delete_title": "Delete",
        "confirm_delete_msg": "Are you sure you want to delete this?",
        
        // Error validations
        "err_nickname_req": "Nickname is required",
        "err_phone_num": "Phone must contain only numbers",
        "err_failed_update_profile": "Failed to update profile",
        "err_failed_delete_account": "Failed to delete account"
    },
    tl: {
        // Dashboard Nav
        "nav_dashboard": "Pangkalahatan",
        "nav_transactions": "Mga Transaksyon",
        "nav_wallets": "Mga Wallet",
        "nav_ai": "Kwarta AI",
        "nav_goals": "Mga Naipong Pera",
        "nav_settings": "Mga Tagpuan",

        // Overview
        "summary_income": "Kita",
        "summary_expense": "Gastos",
        "summary_transfer": "Lipat",

        // Modals / Common
        "btn_save": "I-SAVE",
        "btn_cancel": "Kanselahin",
        "btn_add": "Idagdag",
        "btn_delete": "Tanggalin",
        "btn_edit": "I-edit",

        // Toasts / Messages
        "toast_saved": "Na-save",
        "toast_success": "Tagumpay",
        "toast_error": "Mali",
        "toast_profile_updated": "Matagumpay na na-update ang profile",
        "toast_please_select_image": "Mangyaring pumili ng file ng imahe",
        "toast_image_uploaded": "Na-upload at na-crop ang larawan!",
        "toast_no_transactions_export": "Walang mga transaksyon na ie-export",
        "toast_export_successful": "Matagumpay ang pag-export!",
        "toast_signin_to_delete": "Mag-sign in upang tanggalin ang iyong account",
        "toast_unable_identify_account": "Hindi matukoy ang account",
        "toast_transaction_deleted": "Tinanggal ang transaksyon!",

        "confirm_delete_title": "Tanggalin",
        "confirm_delete_msg": "Sigurado ka bang gusto mong tanggalin ito?",

        // Error validations
        "err_nickname_req": "Kailangan ang palayaw",
        "err_phone_num": "Dapat mga numero lang ang nasa telepono",
        "err_failed_update_profile": "Nabigong i-update ang profile",
        "err_failed_delete_account": "Nabigong tanggalin ang account"
    }
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
        // Handle input placeholders vs text content
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
             // Let's assume if it's an input with data-i18n we want to translate the placeholder if data-i18n-attr="placeholder"
             // Wait, let's use data-i18n-placeholder for clarity
        } else {
             if (dict[key]) el.innerHTML = el.innerHTML.replace(el.textContent, dict[key]);
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) el.placeholder = dict[key];
    });
};
