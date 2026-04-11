import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiTransfer, apiGetTransactions, apiGetWallets } from '../../lib/api';
import { formatCurrency } from '../../lib/utils';

export default function TransferModal() {
  const { activeModal, closeModal, wallets, setWallets, setTransactions, showToast, showCoinLoader, hideCoinLoader } = useApp();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');

  if (activeModal !== 'transfer') return null;

  const handleClose = () => { closeModal(); setFrom(''); setTo(''); setAmount(''); setMessage(''); };

  const fromWallets = (wallets || []).filter(w => String(w.wallet_id) !== to);
  const toWallets = (wallets || []).filter(w => String(w.wallet_id) !== from);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!from || !to) { setMessage('Please select both wallets'); setMsgType('error'); return; }
    if (from === to) { setMessage('Cannot transfer to the same wallet'); setMsgType('error'); return; }
    if (!num || num <= 0) { setMessage('Amount must be greater than 0'); setMsgType('error'); return; }
    const sourceWallet = wallets.find(w => String(w.wallet_id) === from);
    if (sourceWallet && Number(sourceWallet.calculated_balance) < num) {
      setMessage(`Insufficient funds in "${sourceWallet.name}" (Balance: ${formatCurrency(sourceWallet.calculated_balance)})`);
      setMsgType('error'); return;
    }
    showCoinLoader('TRANSFERRING FUNDS...');
    try {
      await apiTransfer(parseInt(from), parseInt(to), num);
      const [newTx, newWallets] = await Promise.all([apiGetTransactions(), apiGetWallets()]);
      setTransactions(newTx); setWallets(newWallets);
      showToast('Transfer completed successfully');
      handleClose();
    } catch (err) { setMessage(err.message); setMsgType('error'); }
    finally { hideCoinLoader(); }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-card transaction-modal-card">
        <button className="modal-close" onClick={handleClose}>×</button>
        <div className="modal-form-container">
          <h2 className="header login-header">Transfer Funds</h2>
          <form className="login-form" id="transfer-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <select className="floating-input" id="transfer-from" required value={from} onChange={e => setFrom(e.target.value)}>
                <option value="" disabled hidden></option>
                {fromWallets.map(w => <option key={w.wallet_id} value={String(w.wallet_id)}>{w.name}</option>)}
              </select>
              <label className="floating-label">From Wallet</label>
            </div>
            <div className="input-group">
              <select className="floating-input" id="transfer-to" required value={to} onChange={e => setTo(e.target.value)}>
                <option value="" disabled hidden></option>
                {toWallets.map(w => <option key={w.wallet_id} value={String(w.wallet_id)}>{w.name}</option>)}
              </select>
              <label className="floating-label">To Wallet</label>
            </div>
            <div className="input-group">
              <input type="number" className="floating-input" id="transfer-amount" placeholder=" " inputMode="decimal" step="0.01" min="0" required value={amount} onChange={e => setAmount(e.target.value)} />
              <label className="floating-label">Amount</label>
            </div>
            {message && <div className={`message ${msgType}`}>{message}</div>}
            <button type="submit" className="btn btn-primary">TRANSFER</button>
          </form>
        </div>
      </div>
    </div>
  );
}
