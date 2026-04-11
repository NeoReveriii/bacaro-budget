import { Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../lib/utils';
import { apiDeleteWallet, apiGetWallets } from '../../lib/api';

export default function WalletDetails({ wallet, transactions, onBack }) {
  const { setWallets, showToast, showConfirm, showCoinLoader, hideCoinLoader } = useApp();
  if (!wallet) return null;

  const walletId = Number(wallet.wallet_id);
  const walletTx = (transactions || []).filter(t => {
    const directId = Number(t.wallet_id);
    const fromId = Number(t.transfer_from_wallet_id);
    const toId = Number(t.transfer_to_wallet_id);
    return directId === walletId || fromId === walletId || toId === walletId || t.wallet_type === wallet.name;
  });

  const totalIncome = walletTx.filter(t => t.type === 'Income').reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = walletTx.filter(t => t.type === 'Expense').reduce((s, t) => s + Number(t.amount), 0);
  const transfersIn = walletTx.filter(t => t.type === 'Transfer' && Number(t.transfer_to_wallet_id) === walletId).reduce((s, t) => s + Number(t.amount), 0);
  const transfersOut = walletTx.filter(t => t.type === 'Transfer' && Number(t.transfer_from_wallet_id) === walletId).reduce((s, t) => s + Number(t.amount), 0);
  const netTransfers = transfersIn - transfersOut;

  const canDelete = walletTx.length === 0;

  const handleDelete = () => {
    showConfirm('Delete Wallet', `Are you sure you want to delete "${wallet.name}"?`, async () => {
      showCoinLoader('DELETING WALLET...');
      try {
        await apiDeleteWallet(wallet.wallet_id);
        showToast('Wallet deleted');
        setWallets(await apiGetWallets());
        onBack();
      } catch (err) { showToast(err.message, 'error'); }
      finally { hideCoinLoader(); }
    });
  };

  const netChange = totalIncome - totalExpense + netTransfers;
  const healthStatus = netChange >= 0 ? 'growing' : 'decreasing';

  return (
    <main id="main-wallet-details">
      <div className="wallet-detail-header">
        <div className="detail-header-left">
          <button className="btn-back" onClick={onBack}>Go Back</button>
          <h2 id="detail-wallet-name">{wallet.name}</h2>
        </div>
        <div className="detail-header-right">
          <span id="detail-wallet-type" className="badge-type">{wallet.type}</span>
          <span id="detail-wallet-status" className={`badge-status ${wallet.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>{wallet.status}</span>
          {canDelete && (
            <button id="btn-delete-wallet-detail" className="btn-delete-wallet" title="Delete Wallet" onClick={handleDelete}>
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="wallet-balance-card">
        <div className="balance-label">Total Balance</div>
        <div className="balance-amount">{formatCurrency(wallet.calculated_balance)}</div>
      </div>

      <div className="wallet-stats-grid">
        <div className="wallet-stat-card income"><div className="stat-label">Income</div><div className="stat-value">{formatCurrency(totalIncome)}</div></div>
        <div className="wallet-stat-card expense"><div className="stat-label">Expense</div><div className="stat-value">{formatCurrency(totalExpense)}</div></div>
        <div className="wallet-stat-card transfer"><div className="stat-label">Transfers</div><div className="stat-value">{formatCurrency(netTransfers)}</div></div>
      </div>

      <div className="wallet-insights-section">
        <div id="wallet-insights-content" className="insights-content">
          {walletTx.length === 0 ? (
            <p>No activity yet. Start by adding a transaction or transfer to see insights!</p>
          ) : (
            <p>This wallet&apos;s balance is currently <strong>{healthStatus}</strong>. You&apos;ve recorded {formatCurrency(totalIncome + transfersIn)} in total inflows and {formatCurrency(totalExpense + transfersOut)} in total outflows.</p>
          )}
        </div>
      </div>

      <div className="wallet-history-section">
        <h3>Recent Transactions</h3>
        <div className="transaction-list">
          <div className="transaction-row header-row">
            <span>#</span><span>TITLE</span><span>AMOUNT</span><span>TYPE</span><span>DATE</span><span></span>
          </div>
          {walletTx.length === 0 ? (
            <div className="empty-history"><p>No transactions found for this wallet.</p></div>
          ) : (
            walletTx.map((t, i) => {
              const type = String(t.type || '').toLowerCase();
              const amountClass = type === 'income' ? 'income' : type === 'expense' ? 'expense' : 'transfer';
              return (
                <div key={t.trans_id || i} className="transaction-item">
                  <div className="transaction-row">
                    <span className="rec-number">{i + 1}</span>
                    <span className="rec-title">{t.description}</span>
                    <span className={`rec-stats ${amountClass}`}>{formatCurrency(t.amount)}</span>
                    <span className="rec-type"><span className={`badge badge-${type}`}>{t.type}</span></span>
                    <span className="rec-date">{formatDate(t.dateoftrans || t.date)}</span>
                    <span></span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
