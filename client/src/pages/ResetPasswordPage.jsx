import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import AnimatedBackground from '../components/layout/AnimatedBackground';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirm) { setMessage('Both fields are required'); setMsgType('error'); return; }
    if (password !== confirm) { setMessage('Passwords do not match'); setMsgType('error'); return; }
    if (password.length < 6) { setMessage('Password must be at least 6 characters'); setMsgType('error'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/reset?action=reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed');
      setMessage(data.message || 'Password reset successfully! You can now log in.');
      setMsgType('success');
    } catch (err) {
      setMessage(err.message || 'Unable to reset password');
      setMsgType('error');
    } finally { setLoading(false); }
  };

  return (
    <div className="guest-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <AnimatedBackground />
      <div className="modal-card" style={{ position: 'relative', zIndex: 10, maxWidth: 440, width: '100%', margin: 20 }}>
        <div className="modal-form-container">
          <h2 className="header">Set New Password</h2>
          {!token ? (
            <p style={{ color: '#e74c3c', textAlign: 'center' }}>Invalid or expired reset link. <Link to="/">Go back</Link></p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input type="password" className="floating-input" placeholder=" " required value={password} onChange={e => setPassword(e.target.value)} />
                <label className="floating-label">New Password</label>
              </div>
              <div className="input-group">
                <input type="password" className="floating-input" placeholder=" " required value={confirm} onChange={e => setConfirm(e.target.value)} />
                <label className="floating-label">Confirm Password</label>
              </div>
              {message && <div className={`message ${msgType}`}>{message}</div>}
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
              {msgType === 'success' && <div style={{ textAlign: 'center', marginTop: 15 }}><Link to="/">→ Go to Home</Link></div>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
