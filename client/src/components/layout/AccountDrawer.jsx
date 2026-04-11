import { useState } from 'react';
import { Camera, RefreshCw, User, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { apiUpdateAccount, apiDeleteAccount } from '../../lib/api';

const BASE_SEEDS = ['Jhun1', 'Budgeter', 'Saver', 'Aventurer', 'Explorer', 'Minter', 'Grinder', 'Hustler'];

function randomSeeds() {
  return Array.from({ length: 8 }, () => Math.random().toString(36).substring(7));
}

export default function AccountDrawer({ isOpen, onClose }) {
  const { user, logout, updateUser } = useAuth();
  const { wallets, goals, showToast, showConfirm, showCoinLoader, hideCoinLoader } = useApp();

  const [editMode, setEditMode] = useState(false);
  const [nickname, setNickname] = useState(user?.username || '');
  const [phone, setPhone] = useState(user?.pnumber || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarSeed, setAvatarSeed] = useState(user?.avatar_seed || null);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || null);
  const [seeds, setSeeds] = useState(BASE_SEEDS);
  const [nickErr, setNickErr] = useState('');
  const [phoneErr, setPhoneErr] = useState('');

  if (!user) return null;

  const initials = (user.username || '??').substring(0, 2).toUpperCase();
  const pfpStyle = avatarUrl
    ? { backgroundImage: `url(${avatarUrl})`, backgroundSize: 'cover' }
    : avatarSeed
    ? { backgroundImage: `url(https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(avatarSeed)})`, backgroundSize: 'cover' }
    : {};

  const totalGoals = (goals || []).reduce((s, g) => s + Number(g.target_amount || 0), 0);
  const badge = totalGoals >= 20000
    ? { label: 'Master Budgeter', cls: 'badge-master' }
    : totalGoals >= 5000
    ? { label: 'Saver', cls: 'badge-saver' }
    : { label: 'Starter', cls: 'badge-starter' };

  const enterEdit = () => {
    setNickname(user.username || '');
    setPhone(user.pnumber || '');
    setBio(user.bio || '');
    setAvatarSeed(user.avatar_seed || null);
    setAvatarUrl(user.avatar_url || null);
    setNickErr(''); setPhoneErr('');
    setEditMode(true);
  };

  const cancelEdit = () => { setEditMode(false); setNickErr(''); setPhoneErr(''); };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setAvatarUrl(ev.target.result); setAvatarSeed(null); };
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    let hasErr = false;
    if (!nickname.trim()) { setNickErr('Nickname is required'); hasErr = true; } else setNickErr('');
    if (phone && !/^\d+$/.test(phone)) { setPhoneErr('Phone must contain only numbers'); hasErr = true; } else setPhoneErr('');
    if (hasErr) return;
    showCoinLoader('SAVING PROFILE...');
    try {
      const updated = await apiUpdateAccount({ id: user.acc_id, username: nickname, pnumber: phone, bio, avatar_seed: avatarSeed, avatar_url: avatarUrl });
      updateUser(updated);
      setEditMode(false);
      showToast('Profile updated successfully');
    } catch (err) { showToast(err.message, 'error'); }
    finally { hideCoinLoader(); }
  };

  const handleLogout = () => { logout(); onClose(); };

  const handleDeleteAccount = () => {
    showConfirm('Delete Account', 'This action is permanent and cannot be undone. Do you want to continue?', async () => {
      showCoinLoader('DELETING ACCOUNT...');
      try {
        await apiDeleteAccount(user.acc_id);
        logout();
      } catch (err) { showToast(err.message, 'error'); }
      finally { hideCoinLoader(); }
    });
  };

  const createdDate = new Date(user.createdat || user.created_at);
  const formattedDate = isNaN(createdDate.getTime()) ? '--' : createdDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <>
      <div id="account-sidebar" className={`account-drawer${isOpen ? ' open' : ''}${editMode ? ' edit-mode' : ''}`}>
        <div className="drawer-header">
          <h3>Account Details</h3>
          <button className="close-drawer" onClick={onClose}>×</button>
        </div>

        <div className="drawer-content">
          <div className="profile-section">
            <div className="large-pfp-container">
              <div className="large-pfp" id="profile-initials" style={pfpStyle}>
                {!avatarUrl && !avatarSeed && initials}
              </div>
              {editMode && (
                <div className="pfp-overlay" onClick={() => document.getElementById('avatar-upload-input').click()}>
                  <Camera size={16} />
                </div>
              )}
              <input type="file" id="avatar-upload-input" hidden accept="image/*" onChange={handleAvatarUpload} />
            </div>
            <h3 id="profile-username" style={{ marginBottom: 5 }}>{user.username}</h3>
            <div id="financial-badge-container" style={{ marginBottom: 25, display: 'flex', justifyContent: 'center' }}>
              <div className={`badge-pill ${badge.cls}`}>{badge.label}</div>
            </div>

            {editMode && (
              <div className="edit-mode-only" style={{ display: 'block' }}>
                <div className="input-group">
                  <input type="text" id="edit-nickname" className="floating-input" placeholder=" " value={nickname} onChange={e => setNickname(e.target.value)} />
                  <label className="floating-label">Nickname</label>
                  {nickErr && <span className="error-msg">{nickErr}</span>}
                </div>
              </div>
            )}
          </div>

          <div className="account-info">
            <div className="info-item">
              <span className="info-label">Email Address</span>
              <span className="info-value" id="profile-email">{user.email}</span>
            </div>
            {!editMode && (
              <>
                <div className="info-item view-mode-only">
                  <span className="info-label">Phone Number</span>
                  <span className="info-value" id="profile-phone">{user.pnumber || 'Not provided'}</span>
                </div>
                <div className="info-item view-mode-only">
                  <span className="info-label">Bio / Goal</span>
                  <span className="info-value" id="profile-bio">{user.bio || 'Not provided'}</span>
                </div>
              </>
            )}
            {editMode && (
              <>
                <div className="edit-mode-only" style={{ display: 'block', textAlign: 'left', marginBottom: 15 }}>
                  <div className="input-group">
                    <input type="tel" id="edit-phone" className="floating-input" placeholder=" " value={phone} onChange={e => setPhone(e.target.value)} />
                    <label className="floating-label">Phone Number</label>
                    {phoneErr && <span className="error-msg">{phoneErr}</span>}
                  </div>
                </div>
                <div className="edit-mode-only" style={{ display: 'block', textAlign: 'left' }}>
                  <div className="input-group">
                    <textarea id="edit-bio" className="floating-input" placeholder=" " style={{ minHeight: 80 }} value={bio} onChange={e => setBio(e.target.value)} />
                    <label className="floating-label">Bio/Goal</label>
                  </div>
                </div>
              </>
            )}
            <div className="info-item">
              <span className="info-label">Member Since</span>
              <span className="info-value" id="profile-createdat">{formattedDate}</span>
            </div>
          </div>

          {editMode && (
            <div className="edit-mode-only" style={{ display: 'block' }}>
              <div className="avatar-grid-header">
                <span>Choose an Avatar</span>
                <button className="btn-randomize" onClick={() => setSeeds(randomSeeds())}><RefreshCw size={16} /></button>
              </div>
              <div className="avatar-grid" id="dicebear-grid">
                {seeds.map(seed => (
                  <div key={seed} className={`avatar-item${avatarSeed === seed ? ' selected' : ''}`} onClick={() => { setAvatarSeed(seed); setAvatarUrl(null); }}>
                    <img src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(seed)}`} alt={seed} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {!editMode && (
            <div className="drawer-nav view-mode-only">
              <a href="#" className="drawer-nav-item" onClick={e => { e.preventDefault(); enterEdit(); }}>
                <User size={16} /> Edit Profile
              </a>
              <a href="#" className="drawer-nav-item"><Shield size={16} /> Security &amp; Privacy</a>
            </div>
          )}

          {editMode && (
            <div className="edit-mode-only drawer-actions" style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn btn-primary" onClick={saveProfile}>Save Changes</button>
              <button className="btn-ghost" onClick={cancelEdit}>Cancel</button>
            </div>
          )}
        </div>

        <div className="drawer-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={16} /> LOG OUT
          </button>
        </div>
      </div>
      <div id="drawer-overlay" className={`drawer-overlay${isOpen ? ' active' : ''}`} onClick={onClose} />
    </>
  );
}
