import { PlusCircle, ArrowLeftRight, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiDeleteWallet, apiGetWallets } from '../../lib/api';
import { formatCurrency } from '../../lib/utils';

export default function WalletGrid({ onWalletClick }) {
  const { wallets, setWallets, openModal, showToast, showConfirm, showCoinLoader, hideCoinLoader } = useApp();

  const handleDelete = (wallet) => {
    showConfirm('Delete Wallet', `Are you sure you want to delete "${wallet.name}"? You can only delete wallets with no transaction history.`, async () => {
      showCoinLoader('DELETING WALLET...');
      try {
        await apiDeleteWallet(wallet.wallet_id);
        showToast('Wallet deleted successfully');
        setWallets(await apiGetWallets());
      } catch (err) { showToast(err.message, 'error'); }
      finally { hideCoinLoader(); }
    });
  };

  const getColorClass = (type) => {
    const t = String(type || '').toLowerCase();
    if (t.includes('cash')) return 'wallet-cash';
    if (t.includes('bank')) return 'wallet-bank';
    if (t.includes('money') || t.includes('e-')) return 'wallet-emoney';
    if (t.includes('credit')) return 'wallet-credit';
    return 'wallet-other';
  };

  return (
    <main id="main-wallets">
      <div className="wallet-actions-bar">
        <button className="btn-wallet-action add" onClick={() => openModal('addWallet')}>
          <span className="icon"><PlusCircle size={16} /></span> Add New Wallet
        </button>
        <button className="btn-wallet-action transfer" onClick={() => openModal('transfer')}>
          <span className="icon"><ArrowLeftRight size={16} /></span> Transfer Funds
        </button>
      </div>

      {(!wallets || wallets.length === 0) ? (
        <div className="wallet-grid loading-transition" id="wallet-grid-container">
          <p style={{ gridColumn: '1 / -1', color: '#666', textAlign: 'center' }}>No wallets found. Add one to get started.</p>
        </div>
      ) : (
        <div className="wallet-grid loading-transition" id="wallet-grid-container">
          {wallets.map(w => (
            <div key={w.wallet_id} className={`card-item ${getColorClass(w.type)}`} onClick={() => onWalletClick(w)}>
              <button className="card-delete-btn" onClick={e => { e.stopPropagation(); handleDelete(w); }}>×</button>
              <div className="card-chip"></div>
              <div className="card-status-badge">{w.status}</div>
              <div className="card-content">
                <h3 className="card-name">{w.name}</h3>
                <p className="card-type">{w.type}</p>
                <p className="card-balance" style={{ fontWeight: 'bold', fontSize: '1.4em' }}>{formatCurrency(w.calculated_balance)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
