import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiForgotPassword } from '../../lib/api';

export default function ForgotModal() {
  const { activeModal, closeModal, openModal } = useApp();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');
  const [loading, setLoading] = useState(false);

  if (activeModal !== 'forgot') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setMessage('Email is required'); setMsgType('error'); return; }
    setLoading(true);
    try {
      const res = await apiForgotPassword(email);
      setMessage(res?.message || 'Reset link sent! Check your email.');
      setMsgType('success');
      setEmail('');
    } catch (err) {
      setMessage(err.message || 'Unable to send reset link');
      setMsgType('error');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-card">
        <button className="modal-close" onClick={closeModal}>×</button>
        <div className="modal-form-container">
          <h2 className="header">Reset Password</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: 20 }}>Enter your email to receive a reset link.</p>
          <form id="forgot-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input type="email" className="floating-input" id="forgot-email" placeholder=" " required value={email} onChange={e => setEmail(e.target.value)} />
              <label className="floating-label">Email Address</label>
            </div>
            {message && <div className={`message ${msgType}`}>{message}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
            <div className="login-link">
              <a href="#" onClick={e => { e.preventDefault(); openModal('login'); }}>Back to Log In</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
