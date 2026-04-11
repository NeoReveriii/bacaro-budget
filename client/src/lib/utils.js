// Utility functions migrated from main.js

export function formatCurrency(amount) {
  const n = Number(amount);
  const showCurrency = localStorage.getItem('bbm_show_currency') !== 'false';
  const symbol = showCurrency ? '₱ ' : '';
  if (!Number.isFinite(n)) return `${symbol}0.00`;
  return `${symbol}${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(value) {
  const d = value ? new Date(value) : null;
  if (!d || Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function readResponsePayload(res) {
  const contentType = res.headers.get('content-type') || '';
  try {
    if (contentType.includes('application/json')) {
      const json = await res.json();
      return { json, text: null };
    }
  } catch { /* fall through */ }
  try {
    const text = await res.text();
    try { return { json: JSON.parse(text), text }; }
    catch { return { json: null, text }; }
  } catch {
    return { json: null, text: null };
  }
}

export function getErrorMessage(payload, fallback) {
  const msg =
    payload?.json?.error ||
    payload?.json?.message ||
    (typeof payload?.text === 'string' ? payload.text : '') ||
    fallback;
  return String(msg || fallback || 'Request failed').trim();
}

export function filterTransactionsByRange(range, transactions) {
  if (!Array.isArray(transactions)) return [];
  if (!range || range === 'ALL TIME') return transactions;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return transactions.filter(tx => {
    const dateVal = tx.dateoftrans || tx.date;
    const txDate = dateVal ? new Date(dateVal) : null;
    if (!txDate || isNaN(txDate.getTime())) return false;
    txDate.setHours(0, 0, 0, 0);
    if (range === 'TODAY') return txDate.getTime() === now.getTime();
    if (range === 'THIS WEEK') {
      const start = new Date(now); start.setDate(now.getDate() - now.getDay());
      return txDate >= start && txDate <= now;
    }
    if (range === 'THIS MONTH') return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    if (range === 'THIS YEAR') return txDate.getFullYear() === now.getFullYear();
    return true;
  });
}
