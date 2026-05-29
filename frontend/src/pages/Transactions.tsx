import React, { useState } from 'react';

const Transactions = () => {
  // Sample data for testing
  const allTransactions = [
    { date: 'Oct 24, 2023', time: '08:15 AM', name: 'Jollibee', desc: 'Lunch Meal', cat: 'Food', wallet: 'GCash', type: 'Expense', amount: '-₱345.00', icon: 'restaurant', iconBg: 'bg-orange-50', iconColor: 'text-orange-600' },
    { date: 'Oct 23, 2023', time: '10:42 AM', name: 'Salary', desc: 'Monthly Payout', cat: 'Income', wallet: 'BDO Savings', type: 'Income', amount: '+₱45,200.00', icon: 'payments', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-700' },
    { date: 'Oct 22, 2023', time: '01:30 PM', name: 'Grab', desc: 'Office Commute', cat: 'Transport', wallet: 'Maya', type: 'Expense', amount: '-₱180.00', icon: 'commute', iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { date: 'Oct 21, 2023', time: '04:55 PM', name: 'Meralco', desc: 'Electricity Bill', cat: 'Bills', wallet: 'BPI Credit', type: 'Expense', amount: '-₱4,200.00', icon: 'bolt', iconBg: 'bg-amber-50', iconColor: 'text-amber-700' },
    { date: 'Oct 20, 2023', time: '07:20 PM', name: 'Netflix', desc: 'Subscription', cat: 'Entertainment', wallet: 'GCash', type: 'Expense', amount: '-₱549.00', icon: 'subscriptions', iconBg: 'bg-rose-50', iconColor: 'text-rose-600' },
    { date: 'Oct 19, 2023', time: '09:05 AM', name: 'SM Store', desc: 'Groceries', cat: 'Retail', wallet: 'Maya', type: 'Expense', amount: '-₱3,500.00', icon: 'shopping_bag', iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
    { date: 'Oct 18, 2023', time: '11:10 AM', name: 'Starbucks', desc: 'Coffee', cat: 'Food', wallet: 'GCash', type: 'Expense', amount: '-₱210.00', icon: 'coffee', iconBg: 'bg-orange-50', iconColor: 'text-orange-600' },
    { date: 'Oct 17, 2023', time: '03:45 PM', name: 'BDO Transfer', desc: 'To Savings', cat: 'Transfer', wallet: 'Maya', type: 'Transfer', amount: '₱5,000.00', icon: 'sync_alt', iconBg: 'bg-slate-50', iconColor: 'text-slate-600' },
    { date: 'Oct 16, 2023', time: '06:30 PM', name: 'Steam', desc: 'Game Purchase', cat: 'Entertainment', wallet: 'BPI Credit', type: 'Expense', amount: '-₱1,250.00', icon: 'sports_esports', iconBg: 'bg-rose-50', iconColor: 'text-rose-600' },
    { date: 'Oct 15, 2023', time: '12:00 PM', name: 'Shell', desc: 'Gasoline', cat: 'Transport', wallet: 'GCash', type: 'Expense', amount: '-₱2,000.00', icon: 'local_gas_station', iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { date: 'Oct 14, 2023', time: '08:45 AM', name: 'Freelance', desc: 'Project Alpha', cat: 'Income', wallet: 'BDO Savings', type: 'Income', amount: '+₱12,000.00', icon: 'work', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-700' },
    { date: 'Oct 13, 2023', time: '05:15 PM', name: 'Gym', desc: 'Monthly Fee', cat: 'Health', wallet: 'Maya', type: 'Expense', amount: '-₱1,500.00', icon: 'fitness_center', iconBg: 'bg-red-50', iconColor: 'text-red-600' },
  ];

  return (
    <div className="min-h-screen pb-20 space-y-8 animate-fade-in">
      {/* HEADER */}
      <header className="flex justify-between items-center">
        <div>
          <h2 className="font-h1 text-h1 text-primary">Transactions</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Manage and monitor your financial activity across all accounts.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-outline-variant text-primary px-6 py-2.5 rounded-xl font-bold text-body-sm hover:bg-slate-50 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-lg">download</span>
            Export
          </button>
        </div>
      </header>

      {/* FILTERS */}
      <section className="grid grid-cols-12 gap-4 mb-6">
        <div className="col-span-3 relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input className="w-full pl-12 pr-4 py-3 bg-white border border-outline-variant rounded-xl text-body-sm focus:ring-2 focus:ring-primary-container/20 focus:border-primary outline-none transition-all" placeholder="Search transactions..." type="text"/>
        </div>
        <div className="col-span-2 relative">
          <select className="w-full appearance-none px-4 pr-10 py-3 bg-white border border-outline-variant rounded-xl text-body-sm text-on-surface font-bold focus:ring-2 focus:ring-primary-container/20 focus:border-primary outline-none transition-all cursor-pointer">
            <option>This Month</option>
            <option>Last 7 Days</option>
            <option>Last 3 Months</option>
            <option>Custom Range</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
        </div>
        <div className="col-span-2 relative">
          <select className="w-full appearance-none px-4 pr-10 py-3 bg-white border border-outline-variant rounded-xl text-body-sm text-on-surface font-bold focus:ring-2 focus:ring-primary-container/20 focus:border-primary outline-none transition-all cursor-pointer">
            <option>All Types</option>
            <option>Expense</option>
            <option>Income</option>
            <option>Transfer</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
        </div>
        <div className="col-span-2 relative">
          <select className="w-full appearance-none px-4 pr-10 py-3 bg-white border border-outline-variant rounded-xl text-body-sm text-on-surface font-bold focus:ring-2 focus:ring-primary-container/20 focus:border-primary outline-none transition-all cursor-pointer">
            <option>All Wallets</option>
            <option>GCash</option>
            <option>BDO Savings</option>
            <option>Maya</option>
            <option>BPI Credit</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">account_balance_wallet</span>
        </div>
        <div className="col-span-2 relative">
          <select className="w-full appearance-none px-4 pr-10 py-3 bg-white border border-outline-variant rounded-xl text-body-sm text-on-surface font-bold focus:ring-2 focus:ring-primary-container/20 focus:border-primary outline-none transition-all cursor-pointer">
            <option>All Categories</option>
            <option>Food &amp; Dining</option>
            <option>Transport</option>
            <option>Utilities</option>
            <option>Health</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
        </div>
        <div className="col-span-1">
          <button className="w-full h-full flex items-center justify-center border border-outline-variant rounded-xl text-slate-400 hover:bg-slate-50 hover:text-primary transition-colors cursor-pointer">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </section>

      {/* DATA TABLE CARD */}
      <section className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 border-b border-outline-variant">
              <tr>
                <th className="px-6 py-4 text-left font-label-caps text-label-caps text-slate-500 uppercase tracking-widest whitespace-nowrap">Date</th>
                <th className="px-6 py-4 text-left font-label-caps text-label-caps text-slate-500 uppercase tracking-widest whitespace-nowrap">Description</th>
                <th className="px-6 py-4 text-left font-label-caps text-label-caps text-slate-500 uppercase tracking-widest whitespace-nowrap">Category</th>
                <th className="px-6 py-4 text-left font-label-caps text-label-caps text-slate-500 uppercase tracking-widest whitespace-nowrap">Wallet</th>
                <th className="px-6 py-4 text-left font-label-caps text-label-caps text-slate-500 uppercase tracking-widest whitespace-nowrap">Type</th>
                <th className="px-6 py-4 text-right font-label-caps text-label-caps text-slate-500 uppercase tracking-widest whitespace-nowrap">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {allTransactions.map((tx, i) => (
                <tr key={i} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <p className="text-body-sm font-bold text-slate-700">{tx.date}</p>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">{tx.time}</p>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${tx.iconBg} ${tx.iconColor} flex items-center justify-center transition-transform group-hover:scale-110`}>
                        <span className="material-symbols-outlined text-[20px]">{tx.icon}</span>
                      </div>
                      <div>
                        <div className="font-bold text-on-surface">{tx.name}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{tx.desc}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-[12px] font-bold border border-slate-100">{tx.cat}</span>
                  </td>
                  <td className="px-6 py-5 text-body-sm text-slate-600 font-bold whitespace-nowrap">{tx.wallet}</td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-[12px] font-bold border ${
                      tx.type === 'Income' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                      tx.type === 'Transfer' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                      'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-6 py-5 text-right font-bold whitespace-nowrap ${
                    tx.type === 'Income' ? 'text-emerald-600' : 
                    tx.type === 'Transfer' ? 'text-blue-600' : 
                    'text-error'
                  }`}>
                    {tx.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* PAGINATION */}
        <div className="px-6 py-6 border-t border-outline-variant flex items-center justify-between">
          <p className="text-body-sm text-slate-500 font-medium">
            Showing <span className="text-on-surface font-bold">1-12</span> of <span className="text-on-surface font-bold">245</span> transactions
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-outline-variant rounded-lg text-body-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              Previous
            </button>
            <div className="flex gap-1">
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-sm cursor-pointer">1</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 font-bold text-sm text-slate-600 cursor-pointer">2</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 font-bold text-sm text-slate-600 cursor-pointer">3</button>
              <span className="w-9 h-9 flex items-center justify-center text-slate-400">...</span>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 font-bold text-sm text-slate-600 cursor-pointer">31</button>
            </div>
            <button className="px-4 py-2 border border-outline-variant rounded-lg text-body-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
              Next
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Transactions;
