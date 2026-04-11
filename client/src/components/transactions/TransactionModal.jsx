import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiSaveTransaction, apiGetTransactions, apiGetWallets } from '../../lib/api';
import { formatCurrency } from '../../lib/utils';

export default function TransactionModal() {
  const { activeModal, closeModal, editingTransaction, setEditingTransaction, wallets, setTransactions, setWallets, showToast, showCoinLoader, hideCoinLoader, transactions } = useApp();

  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [walletId, setWalletId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');

  const isEdit = !!editingTransaction;

  useEffect(() => {
    if (activeModal !== 'transaction') return;
    if (editingTransaction) {
      setDescription(editingTransaction.description || '');
      setType(editingTransaction.type || '');
      setWalletId(String(editingTransaction.wallet_id || ''));
      setAmount(String(editingTransaction.amount || ''));
    } else {
      setDescription(''); setType(''); setWalletId(''); setAmount('');
    }
    setMessage(''); setMsgType('');
  }, [activeModal, editingTransaction]);

  if (activeModal !== 'transaction') return null;

  const handleClose = () => { closeModal(); setEditingTransaction(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = [];
    if (!description.trim()) errors.push('Description is required');
    if (!type) errors.push('Type is required');
    if (!walletId) errors.push('Wallet is required');
    const num = Number(amount);
    if (!amount || !Number.isFinite(num)) errors.push('Valid amount is required');
    if (errors.length) { setMessage(errors[0]); setMsgType('error'); return; }

    // Insufficient funds check for expense
    if (type === 'Expense' && walletId) {
      const w = (wallets || []).find(w => String(w.wallet_id) === walletId);
      if (w) {
        let available = Number(w.calculated_balance || 0);
        if (isEdit && editingTransaction) {
          const orig = editingTransaction;
          if (String(orig.wallet_id) === walletId) {
            if (orig.type === 'Expense') available += Number(orig.amount);
            else if (orig.type === 'Income') available -= Number(orig.amount);
          }
        }
        if (available < num) { setMessage(`Insufficient funds in "${w.name}" (Available: ${formatCurrency(available)})`); setMsgType('error'); return; }
      }
    }

    const walletObj = (wallets || []).find(w => String(w.wallet_id) === walletId);
    const walletType = walletObj?.name || '';

    showCoinLoader(isEdit ? 'UPDATING RECORD...' : 'SAVING TRANSACTION...');
    try {
      const body = {
        ...(isEdit ? { trans_id: editingTransaction.trans_id } : {}),
        description: description.trim(),
        type,
        wallet_type: walletType,
        wallet_id: walletId,
        amount: num,
      };
      await apiSaveTransaction(body);
      handleClose();
      const [newTx, newWallets] = await Promise.all([apiGetTransactions(), apiGetWallets()]);
      setTransactions(newTx);
      setWallets(newWallets);
      showToast(isEdit ? 'Transaction updated' : 'Transaction saved', 'success');
    } catch (err) {
      setMessage(err.message); setMsgType('error');
    } finally { hideCoinLoader(); }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-card transaction-modal-card">
        <button className="modal-close" onClick={handleClose}>×</button>
        <div className="modal-form-container">
          <h2 className="header login-header">{isEdit ? 'Edit Transaction' : 'New Transaction'}</h2>
          <form className="login-form" id="transaction-form" onSubmit={handleSubmit}>
            <input type="hidden" id="trans-id" value={editingTransaction?.trans_id || ''} />
            <div className="input-group">
              <input type="text" className="floating-input" id="trans-description" placeholder=" " required value={description} onChange={e => setDescription(e.target.value)} />
              <label className="floating-label">Description</label>
            </div>
            <div className="input-group">
              <select className="floating-input" id="trans-type" required value={type} onChange={e => setType(e.target.value)}>
                <option value="" disabled hidden></option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
              <label className="floating-label">Type</label>
            </div>
            <div className="input-group">
              <select className="floating-input" id="trans-wallet-type" required value={walletId} onChange={e => setWalletId(e.target.value)}>
                <option value="" disabled hidden></option>
                {(wallets || []).map(w => <option key={w.wallet_id} value={String(w.wallet_id)}>{w.name}</option>)}
              </select>
              <label className="floating-label">Wallet</label>
            </div>
            <div className="input-group">
              <input type="number" className="floating-input" id="trans-amount" placeholder=" " inputMode="decimal" step="1" min="0" required value={amount} onChange={e => setAmount(e.target.value)} />
              <label className="floating-label">Amount</label>
            </div>
            {message && <div className={`message ${msgType}`}>{message}</div>}
            <button type="submit" className="btn btn-primary">SAVE TRANSACTION</button>
          </form>
        </div>
      </div>
    </div>
  );
}
