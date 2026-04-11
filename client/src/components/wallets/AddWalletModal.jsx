import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiCreateWallet, apiGetWallets } from '../../lib/api';

export default function AddWalletModal() {
  const { activeModal, closeModal, setWallets, showToast, showCoinLoader, hideCoinLoader } = useApp();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [balance, setBalance] = useState('');
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');

  if (activeModal !== 'addWallet') return null;

  const handleClose = () => { closeModal(); setName(''); setType(''); setBalance(''); setMessage(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showCoinLoader('SAVING WALLET...');
    try {
      await apiCreateWallet(name.trim(), type, balance);
      setWallets(await apiGetWallets());
      showToast('Wallet created successfully');
      handleClose();
    } catch (err) { setMessage(err.message); setMsgType('error'); }
    finally { hideCoinLoader(); }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-card transaction-modal-card">
        <button className="modal-close" onClick={handleClose}>×</button>
        <div className="modal-form-container">
          <h2 className="header login-header">Add Wallet</h2>
          <form className="login-form" id="add-wallet-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input type="text" className="floating-input" id="wallet-name" placeholder=" " required value={name} onChange={e => setName(e.target.value)} />
              <label className="floating-label">Wallet Name</label>
            </div>
            <div className="input-group">
              <select className="floating-input" id="wallet-type" required value={type} onChange={e => setType(e.target.value)}>
                <option value="" disabled hidden></option>
                <option value="Cash">Cash</option>
                <option value="Bank Account">Bank Account</option>
                <option value="E-Money">E-Money</option>
                <option value="Credit Card">Credit Card</option>
              </select>
              <label className="floating-label">Type</label>
            </div>
            <div className="input-group">
              <input type="number" className="floating-input" id="wallet-initial-balance" placeholder=" " inputMode="decimal" step="0.01" min="0" required value={balance} onChange={e => setBalance(e.target.value)} />
              <label className="floating-label">Initial Balance</label>
            </div>
            {message && <div className={`message ${msgType}`}>{message}</div>}
            <button type="submit" className="btn btn-primary">SAVE WALLET</button>
          </form>
        </div>
      </div>
    </div>
  );
}
