import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiSignup } from '../../lib/api';

export default function SignupModal() {
  const { activeModal, closeModal, openModal, showCoinLoader, hideCoinLoader } = useApp();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [pnumber, setPnumber] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');

  if (activeModal !== 'signup') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) { setMessage('All fields are required'); setMsgType('error'); return; }
    if (password !== confirm) { setMessage('Passwords do not match'); setMsgType('error'); return; }
    if (password.length < 6) { setMessage('Password must be at least 6 characters'); setMsgType('error'); return; }
    showCoinLoader('CREATING ACCOUNT...');
    try {
      await apiSignup(username, email, password, pnumber);
      setMessage('✓ Account created! Please log in.');
      setMsgType('success');
      setTimeout(() => { hideCoinLoader(); openModal('login'); }, 2000);
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
          <h2 className="header">Sign Up</h2>
          <form className="signup-form" id="signup-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input type="text" className="floating-input" id="signup-username" placeholder=" " required value={username} onChange={e => setUsername(e.target.value)} />
              <label className="floating-label">Username</label>
            </div>
            <div className="input-group">
              <input type="email" className="floating-input" id="signup-email" placeholder=" " required value={email} onChange={e => setEmail(e.target.value)} />
              <label className="floating-label">Email Address</label>
            </div>
            <div className="input-group">
              <div className="password-input-wrapper">
                <input type={showPw ? 'text' : 'password'} className="floating-input" id="signup-password" placeholder=" " required value={password} onChange={e => setPassword(e.target.value)} />
                <label className="floating-label">Password</label>
                <span className={`password-toggle${showPw ? ' password-visible' : ''}`} onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>
            <div className="input-group">
              <div className="password-input-wrapper">
                <input type={showConfirmPw ? 'text' : 'password'} className="floating-input" id="signup-confirm" placeholder=" " required value={confirm} onChange={e => setConfirm(e.target.value)} />
                <label className="floating-label">Confirm Password</label>
                <span className={`password-toggle${showConfirmPw ? ' password-visible' : ''}`} onClick={() => setShowConfirmPw(!showConfirmPw)}>
                  {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>
            <div className="input-group">
              <input type="tel" className="floating-input" id="signup-pnumber" placeholder=" " value={pnumber} onChange={e => setPnumber(e.target.value)} />
              <label className="floating-label">Phone Number (Optional)</label>
            </div>
            {message && <div className={`message ${msgType}`}>{message}</div>}
            <button type="submit" className="btn btn-primary">Create Account</button>
            <div className="secondary-action-container">
              <a href="#" onClick={e => { e.preventDefault(); openModal('login'); }} className="btn-secondary-outline">Use Registered Account</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
