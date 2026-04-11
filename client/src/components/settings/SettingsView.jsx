import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const THEME_OPTIONS = [
  { value: 'system', label: 'System Default' },
  { value: 'dark', label: 'Dark Mode' },
  { value: 'light', label: 'Light Mode' },
];

const CURRENCY_OPTIONS = [
  { value: 'show', label: 'Show Currency Symbol (₱)' },
  { value: 'hide', label: 'Hide Currency Symbol' },
];

function applyTheme(value) {
  const body = document.body;
  body.classList.remove('dark-mode', 'light-mode');
  if (value === 'dark') body.classList.add('dark-mode');
  else if (value === 'light') body.classList.add('light-mode');
  else {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) body.classList.add('dark-mode');
    else body.classList.remove('dark-mode');
  }
  localStorage.setItem('bbm_theme', value);
}

export default function SettingsView() {
  const { user, logout } = useAuth();
  const { showToast, showConfirm } = useApp();

  const [theme, setTheme] = useState(localStorage.getItem('bbm_theme') || 'system');
  const [currency, setCurrency] = useState(localStorage.getItem('bbm_show_currency') === 'false' ? 'hide' : 'show');

  const handleThemeChange = (v) => {
    setTheme(v);
    applyTheme(v);
    showToast('Theme updated');
  };

  const handleCurrencyChange = (v) => {
    setCurrency(v);
    localStorage.setItem('bbm_show_currency', v === 'show' ? 'true' : 'false');
    showToast('Currency display updated');
  };

  const handleDeleteAllData = () => {
    showConfirm('Delete All Data', 'This will permanently delete all your transaction, wallet and goal data. Are you sure?', async () => {
      showToast('This feature is not yet available.', 'error');
    });
  };

  return (
    <main id="view-settings">
      <div className="settings-container">
        <h2>Settings</h2>

        <section className="settings-section" id="settings-display-section">
          <h3 className="settings-section-title">Display</h3>
          <div className="settings-item">
            <label>Theme</label>
            <select className="settings-select" value={theme} onChange={e => handleThemeChange(e.target.value)}>
              {THEME_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="settings-item">
            <label>Currency Symbol</label>
            <select className="settings-select" value={currency} onChange={e => handleCurrencyChange(e.target.value)}>
              {CURRENCY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </section>

        <section className="settings-section" id="settings-account-section">
          <h3 className="settings-section-title">Account</h3>
          <div className="settings-item">
            <span>Logged in as</span>
            <strong>{user?.email || '—'}</strong>
          </div>
          <div className="settings-item">
            <span>Username</span>
            <strong>{user?.username || '—'}</strong>
          </div>
        </section>

        <section className="settings-section" id="settings-danger-section">
          <h3 className="settings-section-title" style={{ color: '#e74c3c' }}>Danger Zone</h3>
          <div className="settings-item">
            <button className="btn-danger" onClick={handleDeleteAllData}>Delete All Data</button>
          </div>
          <div className="settings-item">
            <button className="btn-danger" onClick={logout}>Log Out</button>
          </div>
        </section>
      </div>
    </main>
  );
}
