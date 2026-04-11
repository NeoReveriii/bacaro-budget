import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiAddFundsToGoal, apiGetGoals } from '../../lib/api';

export default function AddFundsModal() {
  const { activeModal, closeModal, fundingGoalId, setGoals, showToast, showCoinLoader, hideCoinLoader } = useApp();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');

  if (activeModal !== 'addFunds') return null;

  const handleClose = () => { closeModal(); setAmount(''); setMessage(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) { setMessage('Please enter a valid amount'); setMsgType('error'); return; }
    showCoinLoader('ADDING FUNDS...');
    try {
      await apiAddFundsToGoal(fundingGoalId, num);
      setGoals(await apiGetGoals());
      showToast('Funds added successfully');
      handleClose();
    } catch (err) { setMessage(err.message); setMsgType('error'); }
    finally { hideCoinLoader(); }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-card transaction-modal-card">
        <button className="modal-close" onClick={handleClose}>×</button>
        <div className="modal-form-container">
          <h2 className="header login-header">Add Funds to Goal</h2>
          <form className="login-form" id="add-funds-form" onSubmit={handleSubmit}>
            <input type="hidden" id="fund-goal-id" value={fundingGoalId || ''} />
            <div className="input-group">
              <input type="number" className="floating-input" id="fund-amount" placeholder=" " inputMode="decimal" step="0.01" min="0.01" required value={amount} onChange={e => setAmount(e.target.value)} />
              <label className="floating-label">Amount to Add</label>
            </div>
            {message && <div className={`message ${msgType}`}>{message}</div>}
            <button type="submit" className="btn btn-primary">ADD FUNDS</button>
          </form>
        </div>
      </div>
    </div>
  );
}
