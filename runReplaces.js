const fs = require('fs');

const data = [
  // guest.html words
  { 
    file: 'views/guest.html', 
    replacements: [
      ['Take Control of Your<br>\n                        <span class="hero-highlight">Financial Future</span>', 'Take Control of Your<br>\n                        <span class="hero-highlight" data-i18n="guest_hero_title">Financial Future</span>'],
      ['Track income, expenses, and savings goals with Bacaro Budget Manager — your all-in-one AI-powered finance companion.', '<span data-i18n="guest_hero_sub">Track income, expenses, and savings goals with Bacaro Budget Manager — your all-in-one AI-powered finance companion.</span>'],
      ['Total Balance', '<span data-i18n="guest_total_balance">Total Balance</span>'],
      ['Everything you need to manage money', '<span data-i18n="guest_features_title">Everything you need to manage money</span>'],
      ['<h3>Real-time Dashboard</h3>', '<h3><span data-i18n="guest_feat_1_title">Real-time Dashboard</span></h3>'],
      ['<p>Monitor balances, income, and expenses at a glance with live-updating charts.</p>', '<p data-i18n="guest_feat_1_desc">Monitor balances, income, and expenses at a glance with live-updating charts.</p>'],
      ['<h3>Multi-wallet Support</h3>', '<h3><span data-i18n="guest_feat_2_title">Multi-wallet Support</span></h3>'],
      ['<p>Manage cash, bank accounts, e-wallets, and credit cards all in one place.</p>', '<p data-i18n="guest_feat_2_desc">Manage cash, bank accounts, e-wallets, and credit cards all in one place.</p>'],
      ['<h3>Savings Goals</h3>', '<h3><span data-i18n="guest_feat_3_title">Savings Goals</span></h3>'],
      ['<p>Set and track savings targets with visual progress bars and deadline tracking.</p>', '<p data-i18n="guest_feat_3_desc">Set and track savings targets with visual progress bars and deadline tracking.</p>'],
      ['<h3>Kwarta AI</h3>', '<h3><span data-i18n="guest_feat_4_title">Kwarta AI</span></h3>'],
      ['<p>Get intelligent financial insights and answers powered by AI, tailored to your data.</p>', '<p data-i18n="guest_feat_4_desc">Get intelligent financial insights and answers powered by AI, tailored to your data.</p>'],
      ['<h2 class="header">Welcome Back!</h2>', '<h2 class="header" data-i18n="login_welcome">Welcome Back!</h2>'],
      ['<label class="floating-label">Email Address</label>', '<label class="floating-label" data-i18n="label_email">Email Address</label>'],
      ['<label class="floating-label">Password</label>', '<label class="floating-label" data-i18n="label_pass">Password</label>'],
      ['<button type="submit" class="btn btn-primary">LOG IN</button>', '<button type="submit" class="btn btn-primary" data-i18n="btn_login">LOG IN</button>'],
      ['Forgot Password?', '<span data-i18n="login_forgot">Forgot Password?</span>'],
      ['Create New Account', '<span data-i18n="login_create_acc">Create New Account</span>'],
      ['<h2 class="header">Sign Up</h2>', '<h2 class="header" data-i18n="signup_title">Sign Up</h2>'],
      ['<label class="floating-label">Username</label>', '<label class="floating-label" data-i18n="label_user">Username</label>'],
      ['<label class="floating-label">Confirm Password</label>', '<label class="floating-label" data-i18n="label_conf_pass">Confirm Password</label>'],
      ['<label class="floating-label">Phone Number (Optional)</label>', '<label class="floating-label" data-i18n="label_phone">Phone Number (Optional)</label>'],
      ['Terms and Conditions', '<span data-i18n="signup_terms">Terms and Conditions</span>'],
      ['<button type="submit" class="btn btn-primary">Create Account</button>', '<button type="submit" class="btn btn-primary" data-i18n="btn_create_acc">Create Account</button>'],
      ['Use Registered Account', '<span data-i18n="signup_use_reg">Use Registered Account</span>'],
      ['<h2 class="header">Forgot Password</h2>', '<h2 class="header" data-i18n="forgot_title">Forgot Password</h2>'],
      ['Enter your email to receive a password reset link.', '<span data-i18n="forgot_desc">Enter your email to receive a password reset link.</span>'],
      ['<button type="submit" class="btn btn-primary">Send Reset Link</button>', '<button type="submit" class="btn btn-primary" data-i18n="btn_send_reset">Send Reset Link</button>'],
      ['Back to Log In', '<span data-i18n="btn_back_login">Back to Log In</span>']
    ]
  },
  // dashboard.html words
  {
    file: 'views/dashboard.html',
    replacements: [
      ['<span class="nav-text">Overview</span>', '<span class="nav-text" data-i18n="nav_dashboard">Overview</span>'],
      ['<span class="nav-text">Transactions</span>', '<span class="nav-text" data-i18n="nav_transactions">Transactions</span>'],
      ['<span class="nav-text">Wallets</span>', '<span class="nav-text" data-i18n="nav_wallets">Wallets</span>'],
      ['<span class="nav-text">Kwarta AI</span>', '<span class="nav-text" data-i18n="nav_ai">Kwarta AI</span>'],
      ['<span class="nav-text">Savings Goals</span>', '<span class="nav-text" data-i18n="nav_goals">Savings Goals</span>'],
      ['<span class="nav-text">Settings</span>', '<span class="nav-text" data-i18n="nav_settings">Settings</span>'],
      ['<span class="version-label">Early Alpha</span>', '<span class="version-label" data-i18n="nav_early_alpha">Early Alpha</span>'],
      ['<button class="btn-new-transaction"', '<button class="btn-new-transaction" data-i18n="btn_new_trans"'],
      ['<span class="greeting-text">Welcome back,</span>', '<span class="greeting-text" data-i18n="dash_welcome">Welcome back,</span>'],
      ['<div class="stat-label">Income</div>', '<div class="stat-label" data-i18n="summary_income">Income</div>'],
      ['<div class="stat-label">Expense</div>', '<div class="stat-label" data-i18n="summary_expense">Expense</div>'],
      ['<div class="stat-label">Transfer</div>', '<div class="stat-label" data-i18n="summary_transfer">Transfer</div>'],
      ['<h3>Income\n										Summary</h3>', '<h3><span data-i18n="dash_income_summary">Income Summary</span></h3>'],
      ['<h3>Expense\n										Breakdown</h3>', '<h3><span data-i18n="dash_expense_breakdown">Expense Breakdown</span></h3>'],
      ['<h3>Cash Flow Trend</h3>', '<h3 data-i18n="dash_cash_flow">Cash Flow Trend</h3>'],
      ['placeholder="Search transactions..."', 'data-i18n-placeholder="search_tx" placeholder="Search transactions..."'],
      ['<option value="all">All Types</option>', '<option value="all" data-i18n="opt_all_types">All Types</option>'],
      ['<option value="income">Income</option>', '<option value="income" data-i18n="opt_income">Income</option>'],
      ['<option value="expense">Expense</option>', '<option value="expense" data-i18n="opt_expense">Expense</option>'],
      ['<option value="transfer">Transfer</option>', '<option value="transfer" data-i18n="opt_transfer">Transfer</option>'],
      ['<option value="all">All Wallets</option>', '<option value="all" data-i18n="opt_all_wallets">All Wallets</option>'],
      ['<option value="all">All Time</option>', '<option value="all" data-i18n="opt_all_time">All Time</option>'],
      ['<option value="today">Today</option>', '<option value="today" data-i18n="opt_today">Today</option>'],
      ['<option value="yesterday">Yesterday</option>', '<option value="yesterday" data-i18n="opt_yesterday">Yesterday</option>'],
      ['<option value="this_week">This Week</option>', '<option value="this_week" data-i18n="opt_this_week">This Week</option>'],
      ['<option value="this_month">This Month</option>', '<option value="this_month" data-i18n="opt_this_month">This Month</option>'],
      ['<option value="last_6_months">Last 6 Months</option>', '<option value="last_6_months" data-i18n="opt_last_6_months">Last 6 Months</option>'],
      ['<option value="this_year">This Year</option>', '<option value="this_year" data-i18n="opt_this_year">This Year</option>'],
      ['<span class="icon"><i data-lucide="plus-circle"></i></span> Add New Wallet', '<span class="icon"><i data-lucide="plus-circle"></i></span> <span data-i18n="btn_add_wallet">Add New Wallet</span>'],
      ['<span class="icon"><i data-lucide="arrow-left-right"></i></span> Transfer Funds', '<span class="icon"><i data-lucide="arrow-left-right"></i></span> <span data-i18n="btn_transfer_funds">Transfer Funds</span>'],
      ['<button class="btn-back"\n										onclick="showView(\'wallets\', document.querySelector(\'[onclick*=\\\'wallets\\\']\'))">Go\n										Back</button>', '<button class="btn-back" data-i18n="btn_go_back" onclick="showView(\'wallets\', document.querySelector(\'[onclick*=\\\'wallets\\\']\'))">Go Back</button>'],
      ['<div class="balance-label">Total Balance</div>', '<div class="balance-label" data-i18n="wallet_total_balance">Total Balance</div>'],
      ['<h3>Recent Transactions</h3>', '<h3 data-i18n="wallet_recent_tx">Recent Transactions</h3>'],
      ['<p>No transactions found for this wallet.</p>', '<p data-i18n="wallet_no_tx">No transactions found for this wallet.</p>'],
      ['<span class="icon"><i data-lucide="plus-circle"></i></span> Add New Goal', '<span class="icon"><i data-lucide="plus-circle"></i></span> <span data-i18n="btn_add_goal">Add New Goal</span>'],
      ['<h2 class="settings-title">Preferences</h2>', '<h2 class="settings-title" data-i18n="settings_preferences">Preferences</h2>'],
      ['<p class="settings-subtitle">Personalize how Bacaro Budget Manager looks and\n										behaves.</p>', '<p class="settings-subtitle" data-i18n="settings_subtitle">Personalize how Bacaro Budget Manager looks and behaves.</p>'],
      ['<h4 class="settings-section-title">APPEARANCE</h4>', '<h4 class="settings-section-title" data-i18n="settings_appearance">APPEARANCE</h4>'],
      ['<span class="settings-row-title">Dark Mode</span>', '<span class="settings-row-title" data-i18n="settings_darkmode">Dark Mode</span>'],
      ['<span class="settings-row-title">Contrast Adjustment</span>', '<span class="settings-row-title" data-i18n="settings_contrast">Contrast Adjustment</span>'],
      ['<span class="settings-row-title">Language</span>', '<span class="settings-row-title" data-i18n="settings_lang">Language</span>'],
      ['<span class="settings-row-title">Currency Display</span>', '<span class="settings-row-title" data-i18n="settings_currency">Currency Display</span>'],
      ['<h4 class="settings-section-title">DATA MANAGEMENT</h4>', '<h4 class="settings-section-title" data-i18n="settings_data_mgmt">DATA MANAGEMENT</h4>'],
      ['<span class="settings-row-title">Export Data</span>', '<span class="settings-row-title" data-i18n="settings_export">Export Data</span>'],
      ['<h4 class="settings-section-title">LEGAL</h4>', '<h4 class="settings-section-title" data-i18n="settings_legal">LEGAL</h4>'],
      ['<span class="settings-row-title">Privacy Policy</span>', '<span class="settings-row-title" data-i18n="settings_privacy">Privacy Policy</span>'],
      ['<span class="settings-row-title">Terms of Use</span>', '<span class="settings-row-title" data-i18n="settings_terms">Terms of Use</span>'],
      ['<h4 class="settings-section-title">DANGER ZONE</h4>', '<h4 class="settings-section-title" data-i18n="settings_danger">DANGER ZONE</h4>'],
      ['<span class="settings-row-title title-danger">Delete Account</span>', '<span class="settings-row-title title-danger" data-i18n="settings_del_acc">Delete Account</span>'],
      ['<h3>Account Details</h3>', '<h3 data-i18n="sidebar_acc_details">Account Details</h3>'],
      ['<span class="info-label">Email Address</span>', '<span class="info-label" data-i18n="sidebar_email">Email Address</span>'],
      ['<span class="info-label">Phone Number</span>', '<span class="info-label" data-i18n="sidebar_phone">Phone Number</span>'],
      ['<span class="info-label">Bio / Goal</span>', '<span class="info-label" data-i18n="sidebar_bio">Bio / Goal</span>'],
      ['<span class="info-label">Member Since</span>', '<span class="info-label" data-i18n="sidebar_member_since">Member Since</span>'],
      ['Edit Profile', '<span data-i18n="sidebar_edit_profile">Edit Profile</span>']
    ]
  }
];

for (const d of data) {
  let content = fs.readFileSync(d.file, 'utf8');
  for (const [orig, repl] of d.replacements) {
    if (content.includes(orig)) {
      content = content.replace(orig, repl);
    }
  }
  fs.writeFileSync(d.file, content);
  console.log('Processed', d.file);
}
