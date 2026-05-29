import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-50">
      <div className="p-8 flex items-center gap-3 border-b border-slate-100">
        <img src="/assets/images/bb_logo_db.png" alt="Bacaro Logo" className="w-12 h-12 object-contain rounded-lg shrink-0" />
        <div className="flex flex-col justify-center">
          <h1 className="text-xl font-bold text-primary tracking-tight leading-none mb-1">Bacaro</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Budget Manager</p>
        </div>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 font-bold rounded-lg transition-colors ${
              isActive 
                ? 'bg-emerald-50 text-primary border-l-4 border-primary' 
                : 'text-slate-500 font-medium hover:bg-slate-50'
            }`
          }
        >
          <span className="material-symbols-outlined text-[20px]">dashboard</span> Dashboard
        </NavLink>
        
        <NavLink 
          to="/transactions" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 font-bold rounded-lg transition-colors ${
              isActive 
                ? 'bg-emerald-50 text-primary border-l-4 border-primary' 
                : 'text-slate-500 font-medium hover:bg-slate-50'
            }`
          }
        >
          <span className="material-symbols-outlined text-[20px]">receipt_long</span> Transactions
        </NavLink>
        
        <NavLink 
          to="/wallets" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 font-bold rounded-lg transition-colors ${
              isActive 
                ? 'bg-emerald-50 text-primary border-l-4 border-primary' 
                : 'text-slate-500 font-medium hover:bg-slate-50'
            }`
          }
        >
          <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span> Wallets
        </NavLink>
        
        <NavLink 
          to="/goals" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 font-bold rounded-lg transition-colors ${
              isActive 
                ? 'bg-emerald-50 text-primary border-l-4 border-primary' 
                : 'text-slate-500 font-medium hover:bg-slate-50'
            }`
          }
        >
          <span className="material-symbols-outlined text-[20px]">target</span> Goals
        </NavLink>
        
        <NavLink 
          to="/kwarta-ai" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 font-bold rounded-lg transition-colors ${
              isActive 
                ? 'bg-emerald-50 text-primary border-l-4 border-primary' 
                : 'text-slate-500 font-medium hover:bg-slate-50'
            }`
          }
        >
          <span className="material-symbols-outlined text-[20px]">auto_awesome</span> Kwarta AI
        </NavLink>
      </nav>
      
      <div className="p-4 border-t border-slate-200 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">AP</div>
        <div className="flex-1 overflow-hidden">
          <div className="font-bold text-body-sm text-on-background truncate">Arthur P.</div>
          <div className="text-[12px] text-slate-500 truncate">Premium Plan</div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors ${isActive ? 'text-primary' : ''}`
            }
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
