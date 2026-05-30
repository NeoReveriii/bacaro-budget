// ── API Service Layer ──
// Thin fetch wrapper that attaches the auth token to every request.
// All endpoints are relative (/api/*) so they work on both Vite proxy and Vercel.

const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('bacaro_token');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    // Token expired or invalid — clear and redirect to login
    localStorage.removeItem('bacaro_token');
    localStorage.removeItem('bacaro_user');
    window.location.href = '/';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `API Error ${res.status}`);
  }

  return res.json();
}

// ──────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  data: {
    acc_id: number;
    username: string;
    email: string;
    pnumber: string | null;
    bio: string | null;
    avatar_seed: string | null;
    avatar_url: string | null;
    createdat: string;
  };
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>('/accounts?action=login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// ──────────────────────────────────────────────
// Transactions
// ──────────────────────────────────────────────

export interface Transaction {
  trans_id: number;
  description: string;
  type: string;          // 'Income' | 'Expense' | 'Transfer'
  wallet_type: string;
  wallet_id: number | null;
  transfer_from_wallet_id: number | null;
  transfer_to_wallet_id: number | null;
  amount: string;        // comes as string from NUMERIC
  account_id: number;
  dateoftrans: string;
}

export async function fetchTransactions(): Promise<Transaction[]> {
  return request<Transaction[]>('/transactions');
}

export async function createTransaction(data: {
  description: string;
  type: string;
  wallet_type: string;
  wallet_id?: number;
  amount: number;
}): Promise<Transaction> {
  return request<Transaction>('/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteTransaction(trans_id: number): Promise<Transaction | null> {
  return request<Transaction | null>('/transactions', {
    method: 'DELETE',
    body: JSON.stringify({ trans_id }),
  });
}

export async function transferFunds(data: {
  from_wallet_id: number;
  to_wallet_id: number;
  amount: number;
}): Promise<{ success: boolean; message: string; row: Transaction }> {
  return request('/transactions?action=transfer', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ──────────────────────────────────────────────
// Wallets
// ──────────────────────────────────────────────

export interface Wallet {
  wallet_id: number;
  name: string;
  type: string;
  initial_balance: string;
  status: string;
  created_at: string;
  calculated_balance: string;
}

export async function fetchWallets(): Promise<Wallet[]> {
  const res = await request<{ wallets: Wallet[] }>('/wallets');
  return res.wallets;
}

export async function createWallet(data: {
  name: string;
  type: string;
  initial_balance: number;
}): Promise<{ message: string; wallet: Wallet }> {
  return request('/wallets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateWallet(data: {
  wallet_id: number;
  name: string;
  type: string;
  status?: string;
  initial_balance?: number;
}): Promise<{ message: string; wallet: Wallet }> {
  return request('/wallets', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteWallet(wallet_id: number): Promise<{ message: string }> {
  return request('/wallets', {
    method: 'DELETE',
    body: JSON.stringify({ wallet_id }),
  });
}

// ──────────────────────────────────────────────
// Goals
// ──────────────────────────────────────────────

export interface Goal {
  goal_id: number;
  title: string;
  category: string | null;
  priority: number;
  target_amount: string;
  current_amount: string;
  deadline: string | null;
  status: string;
  allow_expense: boolean;
  created_at: string;
  history: Array<{ amount: string; note: string; created_at: string }> | null;
}

export async function fetchGoals(): Promise<Goal[]> {
  const res = await request<{ goals: Goal[] }>('/goals');
  return res.goals;
}

// ──────────────────────────────────────────────
// Chat History
// ──────────────────────────────────────────────

export interface ChatMessageData {
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export async function fetchChatHistory(): Promise<ChatMessageData[]> {
  const res = await request<{ data: ChatMessageData[] }>('/chat');
  return res.data;
}

export async function clearChatHistory(): Promise<{ success: boolean; message: string }> {
  return request('/chat', {
    method: 'DELETE',
  });
}
