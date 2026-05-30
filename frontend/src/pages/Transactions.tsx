import { useState, useEffect, useMemo } from 'react';
import { fetchTransactions, fetchWallets, createTransaction, deleteTransaction, type Transaction, type Wallet } from '../lib/api';

function formatCurrency(amount: number): string {
  return '₱' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const ICON_MAP: Record<string, { icon: string; iconBg: string; iconColor: string }> = {
  food: { icon: 'restaurant', iconBg: 'bg-orange-50', iconColor: 'text-orange-600' },
  dining: { icon: 'restaurant', iconBg: 'bg-orange-50', iconColor: 'text-orange-600' },
  transport: { icon: 'commute', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  grab: { icon: 'commute', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  bill: { icon: 'bolt', iconBg: 'bg-amber-50', iconColor: 'text-amber-700' },
  electric: { icon: 'bolt', iconBg: 'bg-amber-50', iconColor: 'text-amber-700' },
  internet: { icon: 'wifi', iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  shopping: { icon: 'shopping_bag', iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
  subscription: { icon: 'subscriptions', iconBg: 'bg-rose-50', iconColor: 'text-rose-600' },
  salary: { icon: 'payments', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-700' },
  income: { icon: 'payments', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-700' },
  freelance: { icon: 'work', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-700' },
  transfer: { icon: 'sync_alt', iconBg: 'bg-slate-50', iconColor: 'text-slate-600' },
  health: { icon: 'fitness_center', iconBg: 'bg-red-50', iconColor: 'text-red-600' },
  game: { icon: 'sports_esports', iconBg: 'bg-rose-50', iconColor: 'text-rose-600' },
  gas: { icon: 'local_gas_station', iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  coffee: { icon: 'coffee', iconBg: 'bg-orange-50', iconColor: 'text-orange-600' },
};

function getIconStyle(desc: string, type: string) {
  const lower = desc.toLowerCase();
  for (const [key, style] of Object.entries(ICON_MAP)) {
    if (lower.includes(key)) return style;
  }
  if (type === 'Income') return { icon: 'payments', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-700' };
  if (type === 'Transfer') return { icon: 'sync_alt', iconBg: 'bg-slate-50', iconColor: 'text-slate-600' };
  return { icon: 'receipt_long', iconBg: 'bg-slate-50', iconColor: 'text-slate-600' };
}

const ITEMS_PER_PAGE = 10;

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [walletFilter, setWalletFilter] = useState('All Wallets');
  const [page, setPage] = useState(1);

  // Add Transaction Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTx, setNewTx] = useState({ description: '', type: 'Expense', wallet_id: '', amount: '' });
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [t, w] = await Promise.all([fetchTransactions(), fetchWallets()]);
      setTransactions(t);
      setWallets(w);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  }

  // Filtering
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (search && !tx.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== 'All Types' && tx.type !== typeFilter) return false;
      if (walletFilter !== 'All Wallets' && tx.wallet_type !== walletFilter) return false;
      return true;
    });
  }, [transactions, search, typeFilter, walletFilter]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, typeFilter, walletFilter]);

  async function handleAddTransaction(e: React.FormEvent) {
    e.preventDefault();
    setAddError('');
    setAddLoading(true);

    try {
      const wallet = wallets.find((w) => w.wallet_id === Number(newTx.wallet_id));
      if (!wallet) {
        setAddError('Please select a wallet');
        setAddLoading(false);
        return;
      }

      await createTransaction({
        description: newTx.description,
        type: newTx.type,
        wallet_type: wallet.name,
        wallet_id: wallet.wallet_id,
        amount: Number(newTx.amount),
      });

      setShowAddModal(false);
      setNewTx({ description: '', type: 'Expense', wallet_id: '', amount: '' });
      await loadData();
    } catch (err: unknown) {
      setAddError(err instanceof Error ? err.message : 'Failed to add transaction');
    } finally {
      setAddLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await deleteTransaction(deleteId);
      setDeleteId(null);
      await loadData();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleteLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <span className="material-symbols-outlined animate-spin text-primary text-[48px]">progress_activity</span>
          <p className="text-slate-500 font-medium">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 space-y-8 animate-fade-in">
      {/* HEADER */}
      <header className="flex justify-between items-center">
        <div>
          <h2 className="font-h1 text-h1 text-primary">Transactions</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Manage and monitor your financial activity across all accounts.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-body-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Transaction
          </button>
        </div>
      </header>

      {/* FILTERS */}
      <section className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            className="w-full pl-12 pr-4 py-3 bg-white border border-outline-variant rounded-xl text-body-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            placeholder="Search transactions..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="appearance-none px-4 pr-10 py-3 bg-white border border-outline-variant rounded-xl text-body-sm text-on-surface font-bold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option>All Types</option>
          <option>Expense</option>
          <option>Income</option>
          <option>Transfer</option>
        </select>
        <select
          className="appearance-none px-4 pr-10 py-3 bg-white border border-outline-variant rounded-xl text-body-sm text-on-surface font-bold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
          value={walletFilter}
          onChange={(e) => setWalletFilter(e.target.value)}
        >
          <option>All Wallets</option>
          {wallets.map((w) => (
            <option key={w.wallet_id}>{w.name}</option>
          ))}
        </select>
      </section>

      {/* DATA TABLE */}
      <section className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 border-b border-outline-variant">
              <tr>
                <th className="px-6 py-4 text-left font-label-caps text-label-caps text-slate-500 uppercase tracking-widest whitespace-nowrap">Date</th>
                <th className="px-6 py-4 text-left font-label-caps text-label-caps text-slate-500 uppercase tracking-widest whitespace-nowrap">Description</th>
                <th className="px-6 py-4 text-left font-label-caps text-label-caps text-slate-500 uppercase tracking-widest whitespace-nowrap">Wallet</th>
                <th className="px-6 py-4 text-left font-label-caps text-label-caps text-slate-500 uppercase tracking-widest whitespace-nowrap">Type</th>
                <th className="px-6 py-4 text-right font-label-caps text-label-caps text-slate-500 uppercase tracking-widest whitespace-nowrap">Amount</th>
                <th className="px-6 py-4 text-center font-label-caps text-label-caps text-slate-500 uppercase tracking-widest whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No transactions found</td></tr>
              ) : (
                paginated.map((tx) => {
                  const style = getIconStyle(tx.description, tx.type);
                  const amt = Number(tx.amount);
                  return (
                    <tr key={tx.trans_id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <p className="text-body-sm font-bold text-slate-700">{formatDate(tx.dateoftrans)}</p>
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">{formatTime(tx.dateoftrans)}</p>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${style.iconBg} ${style.iconColor} flex items-center justify-center`}>
                            <span className="material-symbols-outlined text-[20px]">{style.icon}</span>
                          </div>
                          <div className="font-bold text-on-surface">{tx.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-body-sm text-slate-600 font-bold whitespace-nowrap">{tx.wallet_type}</td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-[12px] font-bold border ${
                          tx.type === 'Income' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          tx.type === 'Transfer' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>{tx.type}</span>
                      </td>
                      <td className={`px-6 py-5 text-right font-bold whitespace-nowrap ${
                        tx.type === 'Income' ? 'text-emerald-600' :
                        tx.type === 'Transfer' ? 'text-blue-600' :
                        'text-error'
                      }`}>
                        {tx.type === 'Income' ? '+' : tx.type === 'Expense' ? '-' : ''}{formatCurrency(amt)}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() => setDeleteId(tx.trans_id)}
                          className="p-1.5 text-slate-300 hover:text-error rounded-lg hover:bg-rose-50 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="px-6 py-6 border-t border-outline-variant flex items-center justify-between">
            <p className="text-body-sm text-slate-500 font-medium">
              Showing <span className="text-on-surface font-bold">{(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="text-on-surface font-bold">{filtered.length}</span> transactions
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-outline-variant rounded-lg text-body-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >Previous</button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg font-bold text-sm cursor-pointer ${p === page ? 'bg-primary text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                  >{p}</button>
                ))}
              </div>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-outline-variant rounded-lg text-body-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >Next</button>
            </div>
          </div>
        )}
      </section>

      {/* ADD TRANSACTION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-h3 text-h3 text-primary">Add Transaction</h3>
            </div>
            <form onSubmit={handleAddTransaction} className="p-6 space-y-4">
              {addError && (
                <div className="p-3 bg-error-container/20 border border-error/20 rounded-xl text-error text-body-sm font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>{addError}
                </div>
              )}
              <div>
                <label className="block text-label-caps font-label-caps text-slate-500 uppercase mb-2">Description</label>
                <input
                  type="text"
                  value={newTx.description}
                  onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-outline-variant rounded-xl text-body-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="e.g. Lunch at Jollibee"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-caps font-label-caps text-slate-500 uppercase mb-2">Type</label>
                  <select
                    value={newTx.type}
                    onChange={(e) => setNewTx({ ...newTx, type: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-outline-variant rounded-xl text-body-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                  >
                    <option>Expense</option>
                    <option>Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-label-caps font-label-caps text-slate-500 uppercase mb-2">Amount (₱)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={newTx.amount}
                    onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-outline-variant rounded-xl text-body-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-label-caps font-label-caps text-slate-500 uppercase mb-2">Wallet</label>
                <select
                  value={newTx.wallet_id}
                  onChange={(e) => setNewTx({ ...newTx, wallet_id: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-outline-variant rounded-xl text-body-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                  required
                >
                  <option value="">Select wallet</option>
                  {wallets.map((w) => (
                    <option key={w.wallet_id} value={w.wallet_id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 border border-outline-variant rounded-xl font-bold text-body-sm text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="submit" disabled={addLoading} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-body-sm hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
                  {addLoading ? <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>Adding...</> : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-error-container/20 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-error text-[32px]">delete</span>
            </div>
            <h3 className="font-h3 text-h3 text-on-surface mb-2">Delete Transaction?</h3>
            <p className="text-body-sm text-slate-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border border-outline-variant rounded-xl font-bold text-body-sm text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button onClick={handleDelete} disabled={deleteLoading} className="flex-1 py-3 bg-error text-white rounded-xl font-bold text-body-sm hover:opacity-90 disabled:opacity-50 cursor-pointer">
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
