import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { apiLogin } from '../../lib/api';

export default function LoginModal() {
  const { activeModal, closeModal, openModal, showCoinLoader, hideCoinLoader } = useApp();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');

  if (activeModal !== 'login') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setMessage('Email and password are required'); setMsgType('error'); return; }
    showCoinLoader('VERIFYING CREDENTIALS...');
    try {
      const data = await apiLogin(email, password);
      login(data.token, data.data);
      setMessage('✓ Login successful! Redirecting...');
      setMsgType('success');
      setTimeout(() => { hideCoinLoader(); closeModal(); }, 1000);
    } catch (err) {
      setMessage(err.message || 'An error occurred');
      setMsgType('error');
      hideCoinLoader();
    }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-card">
        <button className="modal-close" onClick={closeModal}>×</button>
        <div className="modal-form-container">
          <h2 className="header">Welcome Back!</h2>
          <form className="login-form" id="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input type="email" className="floating-input" id="login-email" placeholder=" " required value={email} onChange={e => setEmail(e.target.value)} />
              <label className="floating-label">Email Address</label>
            </div>
            <div className="input-group">
              <div className="password-input-wrapper">
                <input type={showPw ? 'text' : 'password'} className="floating-input" id="login-password" placeholder=" " required value={password} onChange={e => setPassword(e.target.value)} />
                <label className="floating-label">Password</label>
                <span className={`password-toggle${showPw ? ' password-visible' : ''}`} onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>
            {message && <div className={`message ${msgType}`}>{message}</div>}
            <button type="submit" className="btn btn-primary">LOG IN</button>
            <div className="forgot-password">
              <a href="#" onClick={e => { e.preventDefault(); openModal('forgot'); }}>Forgot Password?</a>
            </div>
            <div className="secondary-action-container">
              <a href="#" onClick={e => { e.preventDefault(); openModal('signup'); }} className="btn-secondary-outline">Create New Account</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
