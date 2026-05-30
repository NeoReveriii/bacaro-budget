import { useState } from 'react';
import LoginModal from '../components/LoginModal';

const LandingPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="bg-background min-h-screen text-on-surface font-body-md animate-fade-in">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm shadow-emerald-900/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter text-emerald-900">Bacaro</div>
          
          <div className="flex items-center space-x-4">
            <button onClick={() => setShowLoginModal(true)} className="px-4 py-2 text-emerald-900 font-semibold text-sm hover:bg-emerald-50/50 transition-colors rounded-lg cursor-pointer">
              Sign In
            </button>
            <button onClick={() => setShowLoginModal(true)} className="px-5 py-2 bg-primary text-white font-semibold text-sm rounded-lg hover:opacity-90 active:scale-95 duration-150 ease-in-out cursor-pointer">
              Open Account
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="pt-24 pb-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-caps font-bold uppercase">
              Institutional Wealth Management
            </div>
            <h1 className="font-display text-[48px] leading-[1.1] font-extrabold text-primary tracking-tight">
              The Next Evolution in <br />
              <span className="text-secondary">Personal Finance.</span>
            </h1>
            <p className="text-[18px] text-slate-500 max-w-lg leading-relaxed">
              Experience a sophisticated, intelligence-driven platform designed for precision capital management and growth. Built for those who demand institutional-grade reliability.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => setShowLoginModal(true)} className="px-8 py-4 bg-primary text-white rounded-lg font-bold text-[18px] flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer">
                Get Started Free
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Hero UI Mockup */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white rounded-xl shadow-2xl border border-outline-variant overflow-hidden">
              <div className="bg-primary p-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-error"></div>
                  <div className="w-3 h-3 rounded-full bg-secondary-container"></div>
                  <div className="w-3 h-3 rounded-full bg-on-primary-container"></div>
                </div>
                <div className="text-[10px] text-primary-fixed uppercase tracking-widest font-bold">Bacaro Terminal</div>
              </div>
              <div className="p-6 bg-surface-container-low grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-outline-variant">
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1">TOTAL BALANCE</p>
                    <p className="text-[32px] font-bold font-numeric-data text-primary">$428,950.00</p>
                    <div className="mt-4 h-24 w-full bg-emerald-50 rounded relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary-container/30 to-transparent"></div>
                      <svg className="w-full h-full stroke-primary fill-none stroke-2" viewBox="0 0 400 100" preserveAspectRatio="none">
                        <path d="M0,80 Q50,40 100,70 T200,30 T300,50 T400,10"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-outline-variant">
                      <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1">INVESTMENTS</p>
                      <p className="text-[20px] font-bold text-secondary font-numeric-data">+12.4%</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-outline-variant">
                      <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1">LIQUIDITY</p>
                      <p className="text-[20px] font-bold text-primary font-numeric-data">84.2%</p>
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-1 bg-white p-4 rounded-lg border border-outline-variant">
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-4">ASSET ALLOCATION</p>
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-emerald-100 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[60%]"></div>
                    </div>
                    <div className="h-2 w-full bg-emerald-100 rounded-full overflow-hidden">
                      <div className="bg-secondary h-full w-[30%]"></div>
                    </div>
                    <div className="h-2 w-full bg-emerald-100 rounded-full overflow-hidden">
                      <div className="bg-on-primary-container h-full w-[10%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Float element */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-outline-variant flex items-center gap-3 hidden sm:flex">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-secondary-container">verified_user</span>
              </div>
              <div>
                <p className="text-[14px] font-bold text-on-surface">Secure Access</p>
                <p className="text-[10px] text-slate-400 font-medium">256-bit AES Encryption</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 mt-16">
          <div className="bg-primary-container rounded-xl p-12 text-center space-y-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-[48px] font-extrabold text-white mb-4 leading-tight">Elevate Your Strategy.</h2>
              <p className="text-[18px] text-primary-fixed max-w-2xl mx-auto mb-10 leading-relaxed">
                Join over 50,000 high-net-worth individuals and institutions who trust Bacaro for their financial orchestration.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={() => setShowLoginModal(true)} className="px-10 py-4 bg-white text-primary rounded-lg font-bold hover:bg-emerald-50 transition-all cursor-pointer">
                  Start Free Trial
                </button>
                <button onClick={() => setShowLoginModal(true)} className="px-10 py-4 border border-primary-fixed text-primary-fixed rounded-lg font-bold hover:bg-white/10 transition-all cursor-pointer">
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-emerald-200 bg-emerald-50 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="font-bold text-emerald-900 text-[18px]">Bacaro Financial Systems</div>
            <p className="text-[12px] font-medium tracking-wide text-emerald-700/60 leading-relaxed max-w-sm">
              Providing institutional-grade financial infrastructure for the modern era. Secure, intelligent, and private.
            </p>
            <div className="text-[12px] font-medium tracking-wide text-emerald-700/60 mt-4">
              © 2026 Bacaro Financial Systems. All rights reserved.
            </div>
          </div>
          <div className="flex flex-wrap md:justify-end gap-x-8 gap-y-4 text-[12px] font-medium tracking-wide">
            <a className="text-emerald-700/60 hover:text-emerald-900 hover:underline decoration-emerald-500/30 transition-all cursor-pointer">Institutional Disclosure</a>
            <a className="text-emerald-700/60 hover:text-emerald-900 hover:underline decoration-emerald-500/30 transition-all cursor-pointer">Privacy Policy</a>
            <a className="text-emerald-700/60 hover:text-emerald-900 hover:underline decoration-emerald-500/30 transition-all cursor-pointer">Terms of Service</a>
            <a className="text-emerald-700/60 hover:text-emerald-900 hover:underline decoration-emerald-500/30 transition-all cursor-pointer">Security</a>
          </div>
        </div>
      </footer>

      {/* Login Modal Overlay */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
};

export default LandingPage;
