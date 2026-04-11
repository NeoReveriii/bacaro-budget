import { Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function TransactionFilters({ filters, onFilterChange }) {
  const { wallets } = useApp();

  const set = (key, value) => onFilterChange({ ...filters, [key]: value });

  return (
    <div className="view-header" style={{ marginBottom: 20 }}>
      <div className="transaction-filters">
        <div className="tx-search-box">
          <input type="text" id="tx-search" className="tx-filter-input" placeholder="Search transactions..." value={filters.search || ''} onChange={e => set('search', e.target.value)} />
          <Search size={16} className="tx-search-icon" />
        </div>
        <select id="tx-filter-type" className="tx-filter-select" value={filters.type || 'all'} onChange={e => set('type', e.target.value)}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="transfer">Transfer</option>
        </select>
        <select id="tx-filter-wallet" className="tx-filter-select" value={filters.wallet || 'all'} onChange={e => set('wallet', e.target.value)}>
          <option value="all">All Wallets</option>
          {(wallets || []).map(w => <option key={w.wallet_id} value={String(w.wallet_id)}>{w.name}</option>)}
        </select>
        <select id="tx-filter-date" className="tx-filter-select" value={filters.date || 'all'} onChange={e => set('date', e.target.value)}>
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="this_week">This Week</option>
          <option value="this_month">This Month</option>
          <option value="last_6_months">Last 6 Months</option>
          <option value="this_year">This Year</option>
        </select>
      </div>
    </div>
  );
}
