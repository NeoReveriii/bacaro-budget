import { Shield, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'wallets', label: 'Wallets' },
  { id: 'goals', label: 'Goals' },
  { id: 'ai', label: 'Kwarta AI' },
];

export default function Sidebar({ currentView, onNavigate, onNewTransaction, isOpen }) {
  const { openModal } = useApp();

  return (
    <aside id="main-sidebar" className={isOpen ? 'open' : ''}>
      <div className="sidebar-section quick-add-section">
        <button className="btn-quick-add" onClick={onNewTransaction}>
          NEW TRANSACTION
        </button>
      </div>

      <div className="sidebar-section">
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <a
              key={item.id}
              href="#"
              className={`nav-item${currentView === item.id ? ' active' : ''}`}
              onClick={e => { e.preventDefault(); onNavigate(item.id); }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="sidebar-section bottom-section">
        <a href="#" className="nav-item" onClick={e => { e.preventDefault(); openModal('admin'); }}>
          <span className="nav-icon"><Shield size={18} /></span>Administration
        </a>
        <a href="#" className={`nav-item${currentView === 'settings' ? ' active' : ''}`} onClick={e => { e.preventDefault(); onNavigate('settings'); }}>
          <span className="nav-icon"><Settings size={18} /></span>Settings
        </a>
      </div>
    </aside>
  );
}
