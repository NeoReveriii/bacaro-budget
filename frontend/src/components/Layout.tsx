import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isFabOpen, setIsFabOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        <main className="flex-1 pt-10 pb-12 px-12 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
      
      {/* Contextual FAB for Transaction */}
      <div className="fixed bottom-8 right-8 z-[100]">
        {/* Animated Menu (Expanding Upwards) */}
        <div className={`absolute bottom-full right-0 mb-4 flex flex-col gap-3 transition-all duration-300 origin-bottom ${isFabOpen ? 'opacity-100 translate-y-0 scale-100 visible' : 'opacity-0 translate-y-4 scale-90 invisible'}`}>
          <button className="group flex items-center gap-3 bg-white border border-outline-variant px-4 py-3 rounded-2xl shadow-xl hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap">
            <span className="font-bold text-sm text-emerald-700">Add Income</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
          </button>
          <button className="group flex items-center gap-3 bg-white border border-outline-variant px-4 py-3 rounded-2xl shadow-xl hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap">
            <span className="font-bold text-sm text-rose-700">Add Expense</span>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
            </div>
          </button>
          <button className="group flex items-center gap-3 bg-white border border-outline-variant px-4 py-3 rounded-2xl shadow-xl hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap">
            <span className="font-bold text-sm text-blue-700">Add Transfer</span>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">sync_alt</span>
            </div>
          </button>
        </div>

        {/* Main FAB Button */}
        <button 
          onClick={() => setIsFabOpen(!isFabOpen)}
          className={`w-16 h-16 bg-[#003527] text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group ${isFabOpen ? 'ring-4 ring-primary/20' : ''}`}
        >
          <span className={`material-symbols-outlined text-[32px] transition-transform duration-500 ${isFabOpen ? 'rotate-135' : 'rotate-0'}`}>
            add
          </span>
        </button>
      </div>
    </div>
  );
};

export default Layout;
