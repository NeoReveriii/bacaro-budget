import React, { useState } from 'react';

const Wallets = () => {
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);

  const connectedAccounts = [
    { name: 'GCash', sync: '2 mins ago', balance: '₱45,210.00', icon: 'account_balance', iconBg: 'bg-[#007DFE]', color: 'text-white' },
    { name: 'Maya Savings', sync: '5 mins ago', balance: '₱32,150.50', icon: 'wallet', iconBg: 'bg-black', color: 'text-emerald-400', border: 'border-2 border-emerald-400' },
    { name: 'BPI Savings', sync: '1 hour ago', balance: '₱28,070.00', icon: 'account_balance', iconBg: 'bg-[#B71C1C]', color: 'text-white' },
    { name: 'Security Bank', sync: '10 mins ago', balance: '₱20,000.00', icon: 'savings', iconBg: 'bg-[#0D47A1]', color: 'text-white', border: 'border-2 border-[#FFD600]' },
  ];

  const recurringPayments = [
    { name: 'Meralco Bill', info: 'Due in 3 days • Maya Savings', amount: '-₱4,500.00', icon: 'electric_bolt' },
    { name: 'PLDT Home Fibr', info: 'Due in 5 days • BPI Savings', amount: '-₱1,899.00', icon: 'wifi' },
  ];

  return (
    <div className="min-h-screen pb-20 space-y-8 animate-fade-in">
      {/* HEADER */}
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-h1 font-h1 text-on-surface">My Wallets</h2>
          <p className="text-body-sm text-slate-500 mt-1">Total Balance: <span className="font-bold text-emerald-900">₱125,430.50</span></p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
          </div>
          <button className="bg-primary text-white font-body-sm font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer">
            <span className="material-symbols-outlined text-sm">add</span>
            Add Wallet
          </button>
        </div>
      </header>

      {/* ANALYSIS SECTION (BENTO STYLE) */}
      <div className="grid grid-cols-12 gap-6">
        {/* REPLACED NET WORTH TREND WITH WALLET INSIGHTS */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-outline-variant rounded-xl p-8 relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-h3 font-h3 text-on-surface">Wallet Insights</h3>
              <p className="text-body-sm text-slate-500">Summary of your liquid spending power and account health.</p>
            </div>
            <div className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              All Accounts Synced
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Liquid Cash</p>
              <p className="text-2xl font-bold text-primary">₱77,360.50</p>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[62%]"></div>
              </div>
              <p className="text-[10px] text-slate-500 italic">62% of total assets</p>
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Vaulted Savings</p>
              <p className="text-2xl font-bold text-slate-700">₱48,070.00</p>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[38%]"></div>
              </div>
              <p className="text-[10px] text-slate-500 italic">38% of total assets</p>
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Est. Monthly ROI</p>
              <p className="text-2xl font-bold text-emerald-600">+₱1,420</p>
              <div className="flex items-center gap-1 text-emerald-600">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span className="text-[10px] font-bold">+4.2% yield</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-primary">
                <span className="material-symbols-outlined">lightbulb</span>
              </div>
              <p className="text-[13px] text-slate-600 font-medium">Your <span className="font-bold">Maya Savings</span> is earning the highest interest this month.</p>
            </div>
            <button className="text-[12px] font-bold text-primary hover:underline uppercase tracking-wider">Optimize</button>
          </div>
        </div>

        {/* ASSET DISTRIBUTION (INTERACTIVE ORIGINAL DESIGN) */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-outline-variant rounded-xl p-8 shadow-sm">
          <h3 className="font-h3 text-on-surface mb-1">Asset Distribution</h3>
          <p className="text-body-sm text-slate-500 mb-8">Portfolio allocation by asset type</p>
          
          <div className="relative w-44 h-44 mx-auto mb-10">
            {/* Base Circle */}
            <div className="w-full h-full rounded-full border-[14px] border-slate-100 flex items-center justify-center">
              {/* Dynamic Center Text */}
              <div className="text-center transition-all duration-300">
                {hoveredAsset === 'savings' ? (
                  <>
                    <span className="block text-h2 font-numeric-data text-primary animate-fade-in">₱81.5k</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-fade-in">Savings</span>
                  </>
                ) : hoveredAsset === 'cash' ? (
                  <>
                    <span className="block text-h2 font-numeric-data text-emerald-600 animate-fade-in">₱43.9k</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-fade-in">Cash</span>
                  </>
                ) : (
                  <>
                    <span className="block text-h2 font-numeric-data text-primary animate-fade-in">₱125k</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-fade-in">Total</span>
                  </>
                )}
              </div>
            </div>

            {/* Visual segment overlays (Interactive) */}
            <div 
              className={`absolute inset-0 rounded-full border-[14px] border-primary border-t-transparent border-l-transparent transform rotate-45 transition-all duration-300 cursor-pointer ${hoveredAsset === 'savings' ? 'scale-110 opacity-100 z-10 drop-shadow-lg' : hoveredAsset ? 'opacity-30' : 'opacity-90'}`}
              onMouseEnter={() => setHoveredAsset('savings')}
              onMouseLeave={() => setHoveredAsset(null)}
            ></div>
            
            <div 
              className={`absolute inset-0 rounded-full border-[14px] border-emerald-400 border-b-transparent border-r-transparent transform -rotate-12 transition-all duration-300 cursor-pointer ${hoveredAsset === 'cash' ? 'scale-110 opacity-100 z-10 drop-shadow-lg' : hoveredAsset ? 'opacity-30' : 'opacity-100'}`}
              onMouseEnter={() => setHoveredAsset('cash')}
              onMouseLeave={() => setHoveredAsset(null)}
            ></div>
          </div>

          <div className="space-y-4">
            <div 
              className={`flex items-center justify-between text-[13px] p-2 rounded-lg transition-colors cursor-pointer ${hoveredAsset === 'savings' ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
              onMouseEnter={() => setHoveredAsset('savings')}
              onMouseLeave={() => setHoveredAsset(null)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full bg-primary transition-transform ${hoveredAsset === 'savings' ? 'scale-125' : ''}`}></div>
                <span className={`font-medium transition-colors ${hoveredAsset === 'savings' ? 'text-primary font-bold' : 'text-slate-600'}`}>Savings</span>
              </div>
              <span className={`font-bold transition-colors ${hoveredAsset === 'savings' ? 'text-primary' : 'text-on-surface'}`}>65%</span>
            </div>
            <div 
              className={`flex items-center justify-between text-[13px] p-2 rounded-lg transition-colors cursor-pointer ${hoveredAsset === 'cash' ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
              onMouseEnter={() => setHoveredAsset('cash')}
              onMouseLeave={() => setHoveredAsset(null)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full bg-emerald-400 transition-transform ${hoveredAsset === 'cash' ? 'scale-125' : ''}`}></div>
                <span className={`font-medium transition-colors ${hoveredAsset === 'cash' ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}>Cash / E-Wallet</span>
              </div>
              <span className={`font-bold transition-colors ${hoveredAsset === 'cash' ? 'text-emerald-700' : 'text-on-surface'}`}>35%</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONNECTED ACCOUNTS GRID (RESTORED TO ORIGINAL ICON-CARD STYLE) */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-h2 font-h2 text-on-surface">Connected Accounts</h3>
          <div className="flex gap-2">
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">grid_view</span>
            </button>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">list</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {connectedAccounts.map((account, i) => (
            <div key={i} className="bg-white border border-outline-variant rounded-xl p-6 flex flex-col hover:border-emerald-200 transition-all shadow-sm hover:shadow-md cursor-pointer group">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 ${account.iconBg} ${account.border || ''} rounded-full flex items-center justify-center shadow-sm`}>
                  <span className={`material-symbols-outlined ${account.color}`}>{account.icon}</span>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">more_vert</span>
              </div>
              <h4 className="font-bold text-on-surface text-lg">{account.name}</h4>
              <p className="text-[12px] text-slate-500 font-medium">Last synced: {account.sync}</p>
              
              <div className="mt-10 mb-6">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Balance</p>
                <p className="text-2xl font-bold text-emerald-900 font-numeric-data tracking-tight">{account.balance}</p>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                <button className="py-2.5 border border-slate-200 rounded-lg text-[12px] font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">Transfer</button>
                <button className="py-2.5 text-[12px] font-bold text-emerald-900 hover:underline transition-all cursor-pointer">Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RECURRING PAYMENTS SECTION (RESTORED TO BOTTOM) */}
      <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-on-surface text-body-md">Upcoming Recurring Payments</h3>
          <button className="text-primary font-bold text-body-sm hover:underline uppercase tracking-wider text-[11px]">View All</button>
        </div>
        <div className="divide-y divide-slate-100">
          {recurringPayments.map((payment, i) => (
            <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined">{payment.icon}</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface text-lg">{payment.name}</p>
                  <p className="text-[13px] text-slate-500">{payment.info}</p>
                </div>
              </div>
              <span className="font-numeric-data font-bold text-error text-xl">{payment.amount}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Wallets;
