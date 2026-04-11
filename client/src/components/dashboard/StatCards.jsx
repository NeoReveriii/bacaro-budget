import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../lib/utils';
import { filterTransactionsByRange } from '../../lib/utils';

function WalletIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}

export default function StatCards({ transactions }) {
  const { wallets, dashRange, setDashRange } = useApp();

  const filtered = filterTransactionsByRange(dashRange, transactions);

  const income = filtered.filter(t => String(t.type).toLowerCase() === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const expense = filtered.filter(t => String(t.type).toLowerCase() === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const transfer = filtered.filter(t => {
    if (String(t.type).toLowerCase() !== 'transfer') return false;
    const hasStructured = Number(t.transfer_from_wallet_id) > 0 && Number(t.transfer_to_wallet_id) > 0;
    if (hasStructured) return true;
    const desc = String(t.description || '').toLowerCase();
    return desc.includes('out to ') || desc.includes('transfer to ');
  }).reduce((s, t) => s + Number(t.amount), 0);

  const walletTotal = (wallets || []).reduce((s, w) => s + Number(w.calculated_balance || 0), 0);
  const balance = wallets?.length > 0 ? walletTotal : income - expense;

  const RANGE_OPTIONS = ['TODAY', 'THIS WEEK', 'THIS MONTH', 'THIS YEAR', 'ALL TIME'];

  return (
    <>
      <div className="dashboard-filter-container">
        <div className="range-dropdown">
          <button className="range-dropbtn">{dashRange} <span className="arrow-icon">▾</span></button>
          <div className="range-dropdown-content">
            {RANGE_OPTIONS.map(r => (
              <a key={r} href="#" onClick={e => { e.preventDefault(); setDashRange(r); }}>{r}</a>
            ))}
          </div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card wallet-card">
          <span className="stat-icon"><WalletIcon /></span>
          <div className="stat-label">Your Balance</div>
          <div className="stat-value loading-transition">{formatCurrency(balance)}</div>
          <div className="stat-meta">Active Wallet</div>
        </div>
        <div className="stat-card income-card">
          <span className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>
            </svg>
          </span>
          <div className="stat-label">Income</div>
          <div className="stat-value income loading-transition">{formatCurrency(income)}</div>
        </div>
        <div className="stat-card expense-card">
          <span className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline>
            </svg>
          </span>
          <div className="stat-label">Expense</div>
          <div className="stat-value expense loading-transition">{formatCurrency(expense)}</div>
        </div>
        <div className="stat-card transfer-card">
          <span className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m17 2 4 4-4 4"></path><path d="M3 11v-1a4 4 0 0 1 4-4h14"></path><path d="m7 22-4-4 4-4"></path><path d="M21 13v1a4 4 0 0 1-4 4H3"></path>
            </svg>
          </span>
          <div className="stat-label">Transfer</div>
          <div className="stat-value transfer loading-transition">{formatCurrency(transfer)}</div>
        </div>
      </div>
    </>
  );
}
