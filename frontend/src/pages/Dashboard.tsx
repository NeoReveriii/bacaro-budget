import { useState, useEffect } from 'react';
import { fetchWallets, fetchTransactions, type Wallet, type Transaction } from '../lib/api';
import { useAuth } from '../context/AuthContext';

// Icon/color mapping for transaction categories
const CATEGORY_MAP: Record<string, { icon: string; iconBg: string; iconColor: string }> = {
  food: { icon: 'restaurant', iconBg: 'bg-orange-50', iconColor: 'text-orange-600' },
  dining: { icon: 'restaurant', iconBg: 'bg-orange-50', iconColor: 'text-orange-600' },
  lunch: { icon: 'restaurant', iconBg: 'bg-orange-50', iconColor: 'text-orange-600' },
  transport: { icon: 'commute', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  commute: { icon: 'commute', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  grab: { icon: 'commute', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  bill: { icon: 'bolt', iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  electric: { icon: 'bolt', iconBg: 'bg-amber-50', iconColor: 'text-amber-700' },
  internet: { icon: 'wifi', iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  shopping: { icon: 'shopping_bag', iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
  subscription: { icon: 'subscriptions', iconBg: 'bg-rose-50', iconColor: 'text-rose-600' },
  netflix: { icon: 'subscriptions', iconBg: 'bg-rose-50', iconColor: 'text-rose-600' },
  salary: { icon: 'payments', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-700' },
  income: { icon: 'payments', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-700' },
  freelance: { icon: 'work', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-700' },
  transfer: { icon: 'sync_alt', iconBg: 'bg-slate-50', iconColor: 'text-slate-600' },
  health: { icon: 'fitness_center', iconBg: 'bg-red-50', iconColor: 'text-red-600' },
  gym: { icon: 'fitness_center', iconBg: 'bg-red-50', iconColor: 'text-red-600' },
  gas: { icon: 'local_gas_station', iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  game: { icon: 'sports_esports', iconBg: 'bg-rose-50', iconColor: 'text-rose-600' },
};

function getCategoryStyle(description: string, type: string) {
  const lower = description.toLowerCase();
  for (const [key, style] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(key)) return style;
  }
  // Fallback by type
  if (type === 'Income') return { icon: 'payments', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-700' };
  if (type === 'Transfer') return { icon: 'sync_alt', iconBg: 'bg-slate-50', iconColor: 'text-slate-600' };
  return { icon: 'receipt_long', iconBg: 'bg-slate-50', iconColor: 'text-slate-600' };
}

function formatCurrency(amount: number): string {
  return '₱' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

const Dashboard = () => {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [w, t] = await Promise.all([fetchWallets(), fetchTransactions()]);
        setWallets(w);
        setTransactions(t);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // ── Computed values ──
  const totalBalance = wallets.reduce((sum, w) => sum + Number(w.calculated_balance || 0), 0);

  const now = new Date();
  const thisMonthTx = transactions.filter((t) => {
    const d = new Date(t.dateoftrans);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const monthlyIncome = thisMonthTx
    .filter((t) => t.type === 'Income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthlyExpenses = thisMonthTx
    .filter((t) => t.type === 'Expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
  const savingsTarget = 40;
  const savingsCircle = (savingsRate / 100) * 175.9;

  // Top categories (group expenses by first word of description)
  const categoryTotals: Record<string, number> = {};
  thisMonthTx
    .filter((t) => t.type === 'Expense')
    .forEach((t) => {
      const cat = t.description.split(' ')[0] || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(t.amount);
    });

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([label, amount]) => {
      const style = getCategoryStyle(label, 'Expense');
      const percent = monthlyExpenses > 0 ? Math.round((amount / monthlyExpenses) * 100) : 0;
      return { label, amount: formatCurrency(amount), icon: style.icon, bg: style.iconBg, text: style.iconColor, percent: `${percent}%` };
    });

  // Recent transactions (first 5)
  const recentTx = transactions.slice(0, 5);

  const currentMonth = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const displayName = user?.username || 'User';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <span className="material-symbols-outlined animate-spin text-primary text-[48px]">progress_activity</span>
          <p className="text-slate-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-lg animate-fade-in">
      {/* ROW 1: Welcome & Actions */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-h1 text-h1 text-on-background">Welcome back, {displayName}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container font-label-caps text-label-caps rounded-full">{currentMonth}</span>
            <span className="text-body-sm text-on-surface-variant">Last sync: just now</span>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative">
            <select className="appearance-none pl-10 pr-8 py-2 bg-white border border-outline-variant text-slate-600 font-bold text-body-sm rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
              <option value="all">All Wallets</option>
              {wallets.map((w) => (
                <option key={w.wallet_id} value={w.wallet_id}>{w.name}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">account_balance_wallet</span>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">expand_more</span>
          </div>
        </div>
      </section>

      {/* ROW 2: Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* Balance Card */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col gap-2 hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-center">
            <span className="text-label-caps font-label-caps text-on-surface-variant uppercase">Current Balance</span>
            <span className="material-symbols-outlined text-secondary">account_balance_wallet</span>
          </div>
          <div>
            <div className="font-h2 text-h2 text-primary">{formatCurrency(totalBalance)}</div>
            <div className="text-[12px] text-slate-500 font-medium mt-1">Across {wallets.length} wallet{wallets.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
        
        {/* Income Card */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col gap-2 hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-center">
            <span className="text-label-caps font-label-caps text-on-surface-variant uppercase">Monthly Income</span>
            <span className="material-symbols-outlined text-emerald-600">trending_up</span>
          </div>
          <div>
            <div className="font-h2 text-h2 text-on-background">{formatCurrency(monthlyIncome)}</div>
            <div className="flex items-center gap-1 text-[12px] text-emerald-600 font-bold mt-1">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              This month
            </div>
          </div>
        </div>
        
        {/* Expenses Card */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col gap-2 hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-center">
            <span className="text-label-caps font-label-caps text-on-surface-variant uppercase">Monthly Expenses</span>
            <span className="material-symbols-outlined text-error">trending_down</span>
          </div>
          <div>
            <div className="font-h2 text-h2 text-on-background">{formatCurrency(monthlyExpenses)}</div>
            <div className="flex items-center gap-1 text-[12px] text-error font-bold mt-1">
              <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
              This month
            </div>
          </div>
        </div>
        
        {/* Savings Card */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex items-center justify-between gap-4 hover:shadow-sm transition-shadow">
          <div className="flex flex-col gap-2 w-full">
            <span className="text-label-caps font-label-caps text-on-surface-variant uppercase">Savings Rate</span>
            <div>
              <div className="font-h2 text-h2 text-on-background">{savingsRate.toFixed(1)}%</div>
              <div className="text-[12px] text-slate-500 font-medium mt-1">Target: {savingsTarget}%</div>
            </div>
          </div>
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-slate-100" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="6" />
              <circle className="text-primary" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray="175.9" strokeDashoffset={175.9 - savingsCircle} strokeWidth="6" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[20px]">savings</span>
            </div>
          </div>
        </div>
      </section>

      {/* ROW 3: Charts and Top Categories */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-gutter">
        {/* Cash Flow placeholder */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="font-h3 text-h3 text-primary">Cash Flow</h3>
            <span className="text-body-sm text-slate-400">This month</span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-[12px] font-bold text-slate-400 uppercase mb-1">Income</div>
                  <div className="text-xl font-bold text-emerald-600">{formatCurrency(monthlyIncome)}</div>
                </div>
                <div className="w-px h-12 bg-slate-200" />
                <div className="text-center">
                  <div className="text-[12px] font-bold text-slate-400 uppercase mb-1">Expenses</div>
                  <div className="text-xl font-bold text-error">{formatCurrency(monthlyExpenses)}</div>
                </div>
                <div className="w-px h-12 bg-slate-200" />
                <div className="text-center">
                  <div className="text-[12px] font-bold text-slate-400 uppercase mb-1">Net</div>
                  <div className={`text-xl font-bold ${monthlyIncome - monthlyExpenses >= 0 ? 'text-emerald-600' : 'text-error'}`}>
                    {formatCurrency(monthlyIncome - monthlyExpenses)}
                  </div>
                </div>
              </div>
              {/* Progress bar showing income vs expense ratio */}
              <div className="w-full max-w-md mx-auto mt-4">
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                  {monthlyIncome > 0 && (
                    <>
                      <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: `${Math.min((monthlyIncome / (monthlyIncome + monthlyExpenses)) * 100, 100)}%` }} />
                      <div className="h-full bg-rose-400 rounded-r-full" style={{ width: `${Math.min((monthlyExpenses / (monthlyIncome + monthlyExpenses)) * 100, 100)}%` }} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Top Categories */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="font-h3 text-h3 text-primary">Top Categories</h3>
          </div>
          <div className="space-y-5">
            {topCategories.length === 0 ? (
              <p className="text-slate-400 text-body-sm text-center py-8">No expenses this month yet</p>
            ) : (
              topCategories.map((cat, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${cat.bg} ${cat.text} flex items-center justify-center shrink-0`}>
                    <span className="material-symbols-outlined">{cat.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-end mb-1">
                      <span className="font-bold text-on-background">{cat.label}</span>
                      <span className="text-body-sm font-bold text-on-background">{cat.amount}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-primary rounded-full`} style={{ width: cat.percent }} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ROW 4: Recent Activity */}
      <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="p-lg border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-h3 text-h3 text-primary">Recent Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-lg py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">Transaction</th>
                <th className="px-lg py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">Type</th>
                <th className="px-lg py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">Wallet</th>
                <th className="px-lg py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">Date</th>
                <th className="px-lg py-3 font-label-caps text-label-caps text-on-surface-variant uppercase text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTx.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-lg py-8 text-center text-slate-400 text-body-sm">No transactions yet</td>
                </tr>
              ) : (
                recentTx.map((tx) => {
                  const style = getCategoryStyle(tx.description, tx.type);
                  const amt = Number(tx.amount);
                  return (
                    <tr key={tx.trans_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-lg py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${style.iconBg} ${style.iconColor} flex items-center justify-center`}>
                            <span className="material-symbols-outlined">{style.icon}</span>
                          </div>
                          <div>
                            <div className="font-bold text-on-background">{tx.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-lg py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-[12px] font-bold border ${
                          tx.type === 'Income' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          tx.type === 'Transfer' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>{tx.type}</span>
                      </td>
                      <td className="px-lg py-4 text-body-sm text-slate-600 font-bold">{tx.wallet_type}</td>
                      <td className="px-lg py-4 text-body-sm text-on-surface-variant">{formatDate(tx.dateoftrans)}</td>
                      <td className={`px-lg py-4 text-right font-bold ${
                        tx.type === 'Income' ? 'text-emerald-600' :
                        tx.type === 'Transfer' ? 'text-blue-600' :
                        'text-error'
                      }`}>
                        {tx.type === 'Income' ? '+' : tx.type === 'Expense' ? '-' : ''}{formatCurrency(amt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
