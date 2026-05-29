import React, { useState } from 'react';

const Dashboard = () => {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  return (
    <div className="space-y-lg animate-fade-in">
      {/* ROW 1: Welcome & Actions */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-h1 text-h1 text-on-background">Welcome back, Arthur</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container font-label-caps text-label-caps rounded-full">April 2024</span>
            <span className="text-body-sm text-on-surface-variant">Last sync: 2 mins ago</span>
          </div>
        </div>
        
        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Wallet Filter */}
          <div className="relative">
            <select className="appearance-none pl-10 pr-8 py-2 bg-white border border-outline-variant text-slate-600 font-bold text-body-sm rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
              <option value="all">All Wallets</option>
              <option value="gcash">GCash</option>
              <option value="maya">Maya</option>
              <option value="bpi">BPI Savings</option>
            </select>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">account_balance_wallet</span>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">expand_more</span>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <select className="appearance-none pl-10 pr-8 py-2 bg-white border border-outline-variant text-slate-600 font-bold text-body-sm rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_year">This Year</option>
            </select>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">calendar_month</span>
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
            <div className="font-h2 text-h2 text-primary">₱125,430.50</div>
            <div className="text-[12px] text-slate-500 font-medium mt-1">Across all selected wallets</div>
          </div>
        </div>
        
        {/* Income Card */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col gap-2 hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-center">
            <span className="text-label-caps font-label-caps text-on-surface-variant uppercase">Monthly Income</span>
            <span className="material-symbols-outlined text-emerald-600">trending_up</span>
          </div>
          <div>
            <div className="font-h2 text-h2 text-on-background">₱45,200.00</div>
            <div className="flex items-center gap-1 text-[12px] text-emerald-600 font-bold mt-1">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              +12.5% vs last period
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
            <div className="font-h2 text-h2 text-on-background">₱28,750.00</div>
            <div className="flex items-center gap-1 text-[12px] text-error font-bold mt-1">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              +3.2% vs last period
            </div>
          </div>
        </div>
        
        {/* Savings Card */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex items-center justify-between gap-4 hover:shadow-sm transition-shadow">
          <div className="flex flex-col gap-2 w-full">
            <span className="text-label-caps font-label-caps text-on-surface-variant uppercase">Savings Rate</span>
            <div>
              <div className="font-h2 text-h2 text-on-background">36.2%</div>
              <div className="text-[12px] text-slate-500 font-medium mt-1">Target: 40%</div>
            </div>
          </div>
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-slate-100" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="6"></circle>
              <circle className="text-primary" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray="175.9" strokeDashoffset="63" strokeWidth="6"></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[20px]">savings</span>
            </div>
          </div>
        </div>
      </section>

      {/* ROW 3: Charts and Budgets */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-gutter">
        {/* Cash Flow Chart */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="font-h3 text-h3 text-primary">Cash Flow</h3>
            <select className="border border-outline-variant rounded-lg px-3 py-1 text-sm bg-surface-bright text-slate-600 outline-none">
                <option>Last 6 Months</option>
                <option>This Year</option>
            </select>
          </div>
          <div className="h-64 relative">
            <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-400 font-bold">
              <div className="flex items-center gap-4 border-b border-slate-50 w-full pb-1"><span>50k</span></div>
              <div className="flex items-center gap-4 border-b border-slate-50 w-full pb-1"><span>40k</span></div>
              <div className="flex items-center gap-4 border-b border-slate-50 w-full pb-1"><span>30k</span></div>
              <div className="flex items-center gap-4 border-b border-slate-50 w-full pb-1"><span>20k</span></div>
              <div className="flex items-center gap-4 border-b border-slate-100 w-full pb-1"><span>10k</span></div>
            </div>
            <div className="absolute inset-0 ml-8 pb-6">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 200">
                  <path d="M0,150 L100,160 L200,140 L300,120 L400,130 L500,100" fill="none" stroke="#ba1a1a" strokeWidth="2" opacity="0.6"/>
                  <path d="M0,80 L100,90 L200,50 L300,60 L400,30 L500,40" fill="none" stroke="#003527" strokeWidth="3"/>
                  <circle cx="0" cy="80" r="4" fill="#003527" stroke="#fff" strokeWidth="2"/>
                  <circle cx="100" cy="90" r="4" fill="#003527" stroke="#fff" strokeWidth="2"/>
                  <circle cx="200" cy="50" r="4" fill="#003527" stroke="#fff" strokeWidth="2"/>
                  <circle cx="300" cy="60" r="4" fill="#003527" stroke="#fff" strokeWidth="2"/>
                  <circle cx="400" cy="30" r="4" fill="#003527" stroke="#fff" strokeWidth="2"/>
                  <circle cx="500" cy="40" r="4" fill="#003527" stroke="#fff" strokeWidth="2"/>
              </svg>
            </div>
            <div className="absolute bottom-0 w-full ml-8 flex justify-between pr-4">
              <span className="text-[11px] font-bold text-slate-400">OCT</span>
              <span className="text-[11px] font-bold text-slate-400">NOV</span>
              <span className="text-[11px] font-bold text-slate-400">DEC</span>
              <span className="text-[11px] font-bold text-slate-400">JAN</span>
              <span className="text-[11px] font-bold text-slate-400">FEB</span>
              <span className="text-[11px] font-bold text-slate-400">MAR</span>
            </div>
          </div>
        </div>
        
        {/* Top Categories */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="font-h3 text-h3 text-primary">Top Categories</h3>
            <button className="text-primary font-bold text-body-sm hover:underline">See All</button>
          </div>
          <div className="space-y-5">
            {[
              { label: 'Food & Dining', amount: '₱12,450.00', color: 'bg-orange-400', bg: 'bg-orange-50', icon: 'restaurant', text: 'text-orange-600', percent: '65%' },
              { label: 'Transportation', amount: '₱5,200.00', color: 'bg-emerald-500', bg: 'bg-emerald-50', icon: 'commute', text: 'text-emerald-600', percent: '30%' },
              { label: 'Bills & Utilities', amount: '₱4,300.00', color: 'bg-blue-500', bg: 'bg-blue-50', icon: 'bolt', text: 'text-blue-600', percent: '25%' },
              { label: 'Shopping', amount: '₱3,100.00', color: 'bg-purple-500', bg: 'bg-purple-50', icon: 'shopping_bag', text: 'text-purple-600', percent: '15%' },
            ].map((cat, i) => (
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
                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: cat.percent }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROW 4: Recent Activity */}
      <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="p-lg border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-h3 text-h3 text-primary">Recent Activity</h3>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-50 rounded-lg border border-outline-variant">
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
            </button>
            <button className="px-4 py-2 text-primary font-bold text-body-sm hover:bg-slate-50 rounded-lg">View All</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-lg py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">Transaction</th>
                <th className="px-lg py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">Type</th>
                <th className="px-lg py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">Date</th>
                <th className="px-lg py-3 font-label-caps text-label-caps text-on-surface-variant uppercase text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'Jollibee', desc: 'Lunch Meal', cat: 'Food', date: 'Apr 24, 2024', amount: '- ₱345.00', icon: 'restaurant', iconBg: 'bg-orange-50', iconColor: 'text-orange-600' },
                { name: 'Grab', desc: 'Office Commute', cat: 'Transport', date: 'Apr 23, 2024', amount: '- ₱180.00', icon: 'commute', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
                { name: 'Globe', desc: 'Internet Bill', cat: 'Bills', date: 'Apr 22, 2024', amount: '- ₱2,499.00', icon: 'bolt', iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
                { name: 'Netflix', desc: 'Subscription', cat: 'Entertainment', date: 'Apr 20, 2024', amount: '- ₱549.00', icon: 'subscriptions', iconBg: 'bg-red-50', iconColor: 'text-red-600' },
                { name: 'SM Store', desc: 'Shopping', cat: 'Retail', date: 'Apr 19, 2024', amount: '- ₱3,500.00', icon: 'shopping_bag', iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-lg py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${row.iconBg} ${row.iconColor} flex items-center justify-center`}>
                        <span className="material-symbols-outlined">{row.icon}</span>
                      </div>
                      <div>
                        <div className="font-bold text-on-background">{row.name}</div>
                        <div className="text-[12px] text-slate-500">{row.desc}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                  <span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-[12px] font-bold border border-rose-100">Expense</span>
                </td>
                  <td className="px-lg py-4 text-body-sm text-on-surface-variant">{row.date}</td>
                  <td className="px-lg py-4 text-right font-bold text-error">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
