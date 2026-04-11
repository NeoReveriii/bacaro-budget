import { useState } from 'react';
import { Pencil, Trash2, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../lib/utils';
import { apiDeleteTransaction } from '../../lib/api';
import { apiGetTransactions, apiGetWallets } from '../../lib/api';

export default function TransactionList({ transactions, filters, onEdit }) {
  const { setTransactions, setWallets, showToast, showConfirm, showCoinLoader, hideCoinLoader } = useApp();
  const [expanded, setExpanded] = useState(null);

  const filtered = applyFilters(transactions, filters);

  const handleDelete = async (row) => {
    showConfirm('Delete Transaction', 'Are you sure you want to delete this transaction?', async () => {
      showCoinLoader('DELETING TRANSACTION...');
      try {
        await apiDeleteTransaction(row.trans_id);
        showToast('Transaction deleted');
        const [newTx, newWallets] = await Promise.all([apiGetTransactions(), apiGetWallets()]);
        setTransactions(newTx);
        setWallets(newWallets);
      } catch (err) {
        showToast(err.message, 'error');
      } finally { hideCoinLoader(); }
    });
  };

  if (!transactions?.length) {
    return (
      <div className="transaction-list">
        <HeaderRow showWallet />
        <div className="empty-history"><p>No transactions found.</p></div>
      </div>
    );
  }

  if (!filtered.length) {
    return (
      <div className="transaction-list">
        <HeaderRow showWallet />
        <div className="empty-history"><p>No transactions match your filters.</p></div>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <HeaderRow showWallet />
      <div id="transaction-list-items" className="loading-transition">
        {filtered.map((row, idx) => {
          const type = String(row.type || '').toLowerCase();
          const isIncome = type === 'income', isExpense = type === 'expense', isTransfer = type === 'transfer';
          let amountClass = isIncome ? 'income' : isExpense ? 'expense' : 'transfer';
          const badgeClass = isIncome ? 'badge-income' : isExpense ? 'badge-expense' : 'badge-transfer';
          const isOpen = expanded === row.trans_id;

          return (
            <div key={row.trans_id || idx} className={`transaction-item${isOpen ? ' expanded' : ''}`}>
              <div className="transaction-row" onClick={() => setExpanded(isOpen ? null : row.trans_id)}>
                <span className="rec-number">{idx + 1}</span>
                <span className="rec-title">{row.description || row.title || ''}</span>
                <span className={`rec-stats ${amountClass}`}>{formatCurrency(row.amount)}</span>
                <span className="rec-type"><span className={`badge ${badgeClass}`}>{row.type}</span></span>
                <span className="rec-date">{formatDate(row.dateoftrans || row.date)}</span>
                <span className="rec-wallet">{row.wallet_type || ''}</span>
                <span className="rec-actions">
                  <button className="icon-btn edit-btn" type="button" onClick={e => { e.stopPropagation(); onEdit(row); }} title="Edit"><Pencil size={14} /></button>
                  <button className="icon-btn delete-btn" type="button" onClick={e => { e.stopPropagation(); handleDelete(row); }} title="Delete"><Trash2 size={14} /></button>
                  <span className="expand-arrow"><ChevronDown size={14} /></span>
                </span>
              </div>
              {isOpen && (
                <div className="transaction-details">
                  <p><strong>Wallet:</strong> {row.wallet_type || '—'}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HeaderRow({ showWallet }) {
  return (
    <div className="transaction-row header-row">
      <span>#</span><span>TITLE</span><span>AMOUNT</span><span>TYPE</span><span>DATE</span>
      {showWallet && <span>WALLET</span>}
      <span></span>
    </div>
  );
}

function applyFilters(transactions, filters) {
  if (!filters || !transactions) return transactions || [];
  let f = [...transactions];
  const { search, type, wallet, date } = filters;

  if (search) {
    const s = search.toLowerCase();
    f = f.filter(t => (t.description || t.title || '').toLowerCase().includes(s) || String(t.amount || '').includes(s) || (t.wallet_type || '').toLowerCase().includes(s));
  }
  if (type && type !== 'all') f = f.filter(t => String(t.type || '').toLowerCase() === type);
  if (wallet && wallet !== 'all') f = f.filter(t => String(t.wallet_id) === wallet || t.wallet_type === wallet);
  if (date && date !== 'all') {
    const now = new Date(); now.setHours(0, 0, 0, 0);
    f = f.filter(t => {
      const d = new Date(t.dateoftrans || t.date); if (isNaN(d)) return false;
      d.setHours(0, 0, 0, 0);
      if (date === 'today') return d.getTime() === now.getTime();
      if (date === 'yesterday') { const y = new Date(now); y.setDate(y.getDate() - 1); return d.getTime() === y.getTime(); }
      if (date === 'this_week') { const s = new Date(now); s.setDate(now.getDate() - now.getDay()); return d >= s; }
      if (date === 'this_month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      if (date === 'last_6_months') { const s = new Date(now); s.setMonth(s.getMonth() - 6); return d >= s; }
      if (date === 'this_year') return d.getFullYear() === now.getFullYear();
      return true;
    });
  }
  return f;
}
