import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiCreateGoal, apiGetGoals } from '../../lib/api';

export default function AddGoalModal() {
  const { activeModal, closeModal, setGoals, showToast, showCoinLoader, hideCoinLoader } = useApp();
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const [deadline, setDeadline] = useState(tomorrowStr);
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');

  if (activeModal !== 'addGoal') return null;

  const handleClose = () => { closeModal(); setTitle(''); setTarget(''); setDeadline(tomorrowStr); setMessage(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = parseFloat(target);
    if (!title.trim() || isNaN(num) || num <= 0) { setMessage('Please fill in all required fields with valid values.'); setMsgType('error'); return; }
    if (deadline) {
      const sel = new Date(deadline); const today = new Date(); today.setHours(0,0,0,0);
      if (sel < today) { setMessage('Please select a valid future date.'); setMsgType('error'); return; }
    }
    showCoinLoader('SAVING GOAL...');
    try {
      await apiCreateGoal(title.trim(), num, deadline);
      setGoals(await apiGetGoals());
      showToast('Goal created successfully');
      handleClose();
    } catch (err) { setMessage(err.message); setMsgType('error'); }
    finally { hideCoinLoader(); }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-card transaction-modal-card">
        <button className="modal-close" onClick={handleClose}>×</button>
        <div className="modal-form-container">
          <h2 className="header login-header">Add Savings Goal</h2>
          <form className="login-form" id="add-goal-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input type="text" className="floating-input" id="goal-title" placeholder=" " required value={title} onChange={e => setTitle(e.target.value)} />
              <label className="floating-label">Goal Title (e.g., Emergency Fund)</label>
            </div>
            <div className="input-group">
              <input type="number" className="floating-input" id="goal-target-amount" placeholder=" " inputMode="decimal" step="0.01" min="0.01" required value={target} onChange={e => setTarget(e.target.value)} />
              <label className="floating-label">Target Amount</label>
            </div>
            <div className="input-group">
              <input type="date" className="floating-input" id="goal-deadline" min={tomorrowStr} value={deadline} onChange={e => setDeadline(e.target.value)} required />
              <label className="floating-label" style={{ transform: 'translateY(-10px) scale(0.75)', color: 'var(--primary-green)' }}>Target Date</label>
            </div>
            {message && <div className={`message ${msgType}`}>{message}</div>}
            <button type="submit" className="btn btn-primary">SAVE GOAL</button>
          </form>
        </div>
      </div>
    </div>
  );
}
