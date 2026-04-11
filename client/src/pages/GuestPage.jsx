import { useApp } from '../context/AppContext';
import AnimatedBackground from '../components/layout/AnimatedBackground';

export default function GuestPage() {
  const { openModal } = useApp();

  return (
    <div className="guest-container" id="guest-page">
      <AnimatedBackground />

      <header className="guest-header">
        <div className="guest-logo">
          <img src="/assets/images/bb_logo_db.png" alt="Bacaro Budget Logo" />
        </div>
        <div className="guest-header-actions">
          <button className="btn-ghost" onClick={() => openModal('login')}>Log In</button>
          <button className="btn btn-primary" onClick={() => openModal('signup')}>Get Started</button>
        </div>
      </header>

      <main className="guest-main">
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">💰 Smart Personal Finance</div>
            <h1 className="hero-title">
              Take Control of Your<br />
              <span className="hero-highlight">Financial Future</span>
            </h1>
            <p className="hero-subtitle">
              Track income, expenses, and savings goals with Bacaro Budget Manager — your all-in-one AI-powered finance companion.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => openModal('signup')}>Start For Free</button>
              <button className="btn-ghost btn-lg" onClick={() => openModal('login')}>Sign In →</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-label">Total Balance</div>
              <div className="hero-card-value">₱ 128,450.00</div>
              <div className="hero-card-stats" style={{ display: 'flex', gap: 20, marginTop: 15 }}>
                <span className="badge-income">↑ Income ₱45,000</span>
                <span className="badge-expense">↓ Expense ₱18,200</span>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2>Everything you need to manage money</h2>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

const FEATURES = [
  { icon: '📊', title: 'Real-time Dashboard', desc: 'Monitor balances, income, and expenses at a glance with live-updating charts.' },
  { icon: '💼', title: 'Multi-wallet Support', desc: 'Manage cash, bank accounts, e-wallets, and credit cards all in one place.' },
  { icon: '🎯', title: 'Savings Goals', desc: 'Set and track savings targets with visual progress bars and deadline tracking.' },
  { icon: '🤖', title: 'Kwarta AI', desc: 'Get intelligent financial insights and answers powered by AI, tailored to your data.' },
];
