import React from 'react';

const Settings = () => {
  return (
    <div className="max-w-[800px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-lg">
        <h2 className="font-h1 text-h1 text-primary">Settings</h2>
        <p className="font-body-md text-on-surface-variant mt-2">Manage your account preferences and system configurations.</p>
      </header>

      {/* Appearance Section */}
      <section className="mb-gutter">
        <div className="flex items-center gap-2 mb-sm">
          <span className="material-symbols-outlined text-secondary text-[20px]">palette</span>
          <h3 className="font-label-caps text-label-caps text-outline uppercase tracking-widest">Appearance</h3>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden divide-y divide-outline-variant/30">
          {/* Dark Mode Row */}
          <div className="p-md flex items-center justify-between hover:bg-surface-container-low transition-colors">
            <div>
              <p className="font-body-md font-bold text-on-surface">Dark Mode</p>
              <p className="font-body-sm text-on-surface-variant">Switch between standard and low-light interface themes.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer hover:scale-105 transition-transform">
              <input className="sr-only peer" type="checkbox" />
              <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Contrast Row */}
          <div className="p-md flex items-center justify-between hover:bg-surface-container-low transition-colors">
            <div>
              <p className="font-body-md font-bold text-on-surface">Contrast Adjustment</p>
              <p className="font-body-sm text-on-surface-variant">Toggle between normal and high contrast modes.</p>
            </div>
            <button className="bg-surface-container-high text-primary px-md py-sm rounded-lg font-body-sm font-bold border border-outline-variant hover:bg-surface-dim hover:text-primary-container hover:shadow-sm transition-all active:scale-95">
              Normal Contrast
            </button>
          </div>

          {/* Language Row */}
          <div className="p-md flex items-center justify-between hover:bg-surface-container-low transition-colors">
            <div>
              <p className="font-body-md font-bold text-on-surface">Language</p>
              <p className="font-body-sm text-on-surface-variant">Select your preferred display language.</p>
            </div>
            <div className="relative group">
              <select className="appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-md pr-10 py-sm font-body-sm font-semibold text-on-surface focus:ring-primary focus:border-primary group-hover:bg-surface-container-high transition-colors cursor-pointer outline-none">
                <option>English</option>
                <option>Filipino</option>
                <option>Spanish</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[20px]">expand_more</span>
            </div>
          </div>

          {/* Currency Display Row */}
          <div className="p-md flex items-center justify-between hover:bg-surface-container-low transition-colors">
            <div>
              <p className="font-body-md font-bold text-on-surface">Currency Display</p>
              <p className="font-body-sm text-on-surface-variant">Show or hide the Pesos symbol (₱) in amounts.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer hover:scale-105 transition-transform">
              <input defaultChecked className="sr-only peer" type="checkbox" />
              <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </section>

      {/* Data Management Section */}
      <section className="mb-gutter">
        <div className="flex items-center gap-2 mb-sm">
          <span className="material-symbols-outlined text-secondary text-[20px]">database</span>
          <h3 className="font-label-caps text-label-caps text-outline uppercase tracking-widest">Data Management</h3>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
          <div className="p-md flex items-center justify-between hover:bg-surface-container-low transition-colors">
            <div>
              <p className="font-body-md font-bold text-on-surface">Export Data</p>
              <p className="font-body-sm text-on-surface-variant">Download a CSV file containing all your transaction records.</p>
            </div>
            <button className="bg-secondary text-white px-md py-sm rounded-lg font-body-sm font-bold shadow-sm hover:bg-primary hover:shadow-md transition-all flex items-center gap-2 active:scale-95">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
              Download CSV
            </button>
          </div>
        </div>
      </section>

      {/* Legal Section */}
      <section className="mb-gutter">
        <div className="flex items-center gap-2 mb-sm">
          <span className="material-symbols-outlined text-secondary text-[20px]">gavel</span>
          <h3 className="font-label-caps text-label-caps text-outline uppercase tracking-widest">Legal</h3>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden divide-y divide-outline-variant/30">
          <div className="p-md flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group/row">
            <p className="font-body-md font-bold text-on-surface">Privacy Policy</p>
            <button className="text-primary hover:text-primary-container font-body-sm font-bold flex items-center gap-1 group">
              View Policy
              <span className="material-symbols-outlined group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" style={{ fontSize: '16px' }}>open_in_new</span>
            </button>
          </div>
          <div className="p-md flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group/row">
            <p className="font-body-md font-bold text-on-surface">Terms of Use</p>
            <button className="text-primary hover:text-primary-container font-body-sm font-bold flex items-center gap-1 group">
              View Terms
              <span className="material-symbols-outlined group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" style={{ fontSize: '16px' }}>open_in_new</span>
            </button>
          </div>
        </div>
      </section>

      {/* Danger Zone Section */}
      <section className="mb-gutter">
        <div className="flex items-center gap-2 mb-sm">
          <span className="material-symbols-outlined text-error text-[20px]">warning</span>
          <h3 className="font-label-caps text-label-caps text-error uppercase tracking-widest">Danger Zone</h3>
        </div>
        <div className="bg-surface-container-lowest border border-error/20 rounded-lg overflow-hidden">
          <div className="p-md flex items-center justify-between bg-error-container/10 hover:bg-error-container/30 transition-colors">
            <div>
              <p className="font-body-md font-bold text-on-error-container">Delete Account</p>
              <p className="font-body-sm text-on-surface-variant">Permanently remove your account and all associated budget data.</p>
            </div>
            <button className="bg-error text-white px-md py-sm rounded-lg font-body-sm font-bold shadow-sm hover:bg-[#93000a] hover:shadow-md transition-all active:scale-95">
              Delete Account
            </button>
          </div>
        </div>
      </section>

      {/* Branding Footer */}
      <footer className="mt-xl pt-lg border-t border-outline-variant/30 text-center">
        <p className="font-label-caps text-outline uppercase tracking-tighter opacity-50">Bacaro Institutional Suite v4.2.0</p>
      </footer>
    </div>
  );
};

export default Settings;
