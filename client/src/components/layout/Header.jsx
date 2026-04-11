import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Menu } from 'lucide-react';

export default function Header({ onMenuClick, onProfileClick }) {
  const { user } = useAuth();
  const { openModal } = useApp();
  const [reportsOpen, setReportsOpen] = useState(false);

  const initials = user ? (user.username || '??').substring(0, 2).toUpperCase() : '--';

  const getAvatarStyle = () => {
    if (user?.avatar_url) return { backgroundImage: `url(${user.avatar_url})`, backgroundSize: 'cover' };
    if (user?.avatar_seed) return { backgroundImage: `url(https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(user.avatar_seed)})`, backgroundSize: 'cover' };
    return {};
  };

  return (
    <header id="main-header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuClick} title="Menu">
          <Menu size={24} />
        </button>
        <div className="header-logo-container">
          <img src="/assets/images/bb_logo_db.png" alt="App Logo" />
        </div>
        <div className="header-title">Bacaro Budget Manager</div>
      </div>

      <nav className="header-right">
        {user ? (
          <>
            <div className="reports-dropdown-container" onMouseEnter={() => setReportsOpen(true)} onMouseLeave={() => setReportsOpen(false)}>
              <button className="dropdown-button">Reports ▾</button>
              {reportsOpen && (
                <div className="dropdown-content" style={{ display: 'block' }}>
                  <a href="#daily">Daily</a>
                  <a href="#weekly">Weekly</a>
                  <a href="#monthly">Monthly</a>
                  <a href="#annually">Annually</a>
                </div>
              )}
            </div>
            <div
              className="account-pfp-placeholder"
              id="header-pfp"
              onClick={onProfileClick}
              style={getAvatarStyle()}
            >
              {!user?.avatar_url && !user?.avatar_seed && (
                <span id="header-initials">{initials}</span>
              )}
            </div>
          </>
        ) : (
          <button className="header-signin-btn" onClick={() => openModal('login')}>Sign In</button>
        )}
      </nav>
    </header>
  );
}
