import { readResponsePayload, getErrorMessage } from './utils';

const BASE = '';

function getToken() {
  return localStorage.getItem('bbm_token');
}

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' };
}

// ── Auth ──────────────────────────────────────────────────────────
export async function apiLogin(email, password) {
  const res = await fetch(`${BASE}/api/accounts?action=login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function apiSignup(username, email, password, pnumber) {
  const res = await fetch(`${BASE}/api/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, pnumber: pnumber || null }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Signup failed');
  return data;
}

export async function apiForgotPassword(email) {
  const res = await fetch(`${BASE}/api/reset?action=forgot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const payload = await readResponsePayload(res);
  if (!res.ok) throw new Error(getErrorMessage(payload, 'Unable to send reset link'));
  return payload.json;
}

// ── Transactions ──────────────────────────────────────────────────
export async function apiGetTransactions() {
  const res = await fetch(`${BASE}/api/transactions`, { headers: authHeaders() });
  const payload = await readResponsePayload(res);
  if (!res.ok) throw new Error(getErrorMessage(payload, 'Failed to load transactions'));
  const data = payload?.json;
  return Array.isArray(data) ? data : data?.data || [];
}

export async function apiSaveTransaction(body) {
  const method = body.trans_id ? 'PUT' : 'POST';
  const res = await fetch(`${BASE}/api/transactions`, {
    method,
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  const payload = await readResponsePayload(res);
  if (!res.ok) throw new Error(getErrorMessage(payload, 'Failed to save transaction'));
  return payload.json;
}

export async function apiDeleteTransaction(id) {
  const res = await fetch(`${BASE}/api/transactions`, {
    method: 'DELETE',
    headers: authHeaders(),
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('Delete failed');
}

export async function apiTransfer(from_wallet_id, to_wallet_id, amount) {
  const res = await fetch(`${BASE}/api/transactions?action=transfer`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ from_wallet_id, to_wallet_id, amount }),
  });
  const payload = await readResponsePayload(res);
  if (!res.ok) throw new Error(getErrorMessage(payload, 'Transfer failed'));
  return payload.json;
}

// ── Wallets ───────────────────────────────────────────────────────
export async function apiGetWallets() {
  const res = await fetch(`${BASE}/api/wallets`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load wallets');
  const data = await res.json();
  return data.wallets || [];
}

export async function apiCreateWallet(name, type, initial_balance) {
  const res = await fetch(`${BASE}/api/wallets`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name, type, initial_balance }),
  });
  const payload = await readResponsePayload(res);
  if (!res.ok) throw new Error(getErrorMessage(payload, 'Failed to create wallet'));
  return payload.json;
}

export async function apiDeleteWallet(wallet_id) {
  const res = await fetch(`${BASE}/api/wallets`, {
    method: 'DELETE',
    headers: authHeaders(),
    body: JSON.stringify({ wallet_id }),
  });
  const payload = await readResponsePayload(res);
  if (!res.ok) throw new Error(getErrorMessage(payload, 'Failed to delete wallet'));
  return payload.json;
}

// ── Goals ─────────────────────────────────────────────────────────
export async function apiGetGoals() {
  const res = await fetch(`${BASE}/api/goals`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load goals');
  const data = await res.json();
  return data.goals || [];
}

export async function apiCreateGoal(title, target_amount, deadline) {
  const res = await fetch(`${BASE}/api/goals`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ title, target_amount, deadline }),
  });
  const payload = await readResponsePayload(res);
  if (!res.ok) throw new Error(getErrorMessage(payload, 'Failed to create goal'));
  return payload.json;
}

export async function apiAddFundsToGoal(goal_id, add_amount) {
  const res = await fetch(`${BASE}/api/goals`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ goal_id, add_amount }),
  });
  const payload = await readResponsePayload(res);
  if (!res.ok) throw new Error(getErrorMessage(payload, 'Failed to update goal'));
  return payload.json;
}

export async function apiDeleteGoal(goal_id) {
  const res = await fetch(`${BASE}/api/goals`, {
    method: 'DELETE',
    headers: authHeaders(),
    body: JSON.stringify({ goal_id }),
  });
  const payload = await readResponsePayload(res);
  if (!res.ok) throw new Error(getErrorMessage(payload, 'Failed to delete goal'));
  return payload.json;
}

// ── Account ───────────────────────────────────────────────────────
export async function apiUpdateAccount(body) {
  const res = await fetch(`${BASE}/api/accounts`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  const payload = await readResponsePayload(res);
  if (!res.ok) throw new Error(getErrorMessage(payload, 'Failed to update profile'));
  return payload.json?.data;
}

export async function apiDeleteAccount(id) {
  const res = await fetch(`${BASE}/api/accounts`, {
    method: 'DELETE',
    headers: authHeaders(),
    body: JSON.stringify({ id }),
  });
  const payload = await readResponsePayload(res);
  if (!res.ok) throw new Error(getErrorMessage(payload, 'Failed to delete account'));
}

// ── Chat ──────────────────────────────────────────────────────────
export async function apiGetChat() {
  const res = await fetch(`${BASE}/api/chat`, { headers: authHeaders() });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export async function apiSendChat(message) {
  return fetch(`${BASE}/api/chat`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ message }),
  });
}

export async function apiClearChat() {
  await fetch(`${BASE}/api/chat`, { method: 'DELETE', headers: authHeaders() });
}
