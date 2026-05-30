import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-surface-dim min-h-screen flex items-center justify-center p-md relative z-0">
      {/* Background Decorative Element (Atmospheric) */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-secondary-container/10 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary-container/5 blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4"></div>
      </div>

      <main 
        className={`w-full max-w-[440px] transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {/* The Minimalist Card */}
        <div className="bg-surface-container-lowest border-t-[4px] border-primary-container rounded-lg shadow-[0_4px_64px_-12px_rgba(0,30,21,0.08)] overflow-hidden flex flex-col relative">
          
          {/* Modal Header */}
          <div className="px-xl pt-xxl pb-lg text-center">
            <div className="flex justify-center mb-md">
              <span className="material-symbols-outlined text-primary text-[40px]">shield_person</span>
            </div>
            <h1 className="font-h1 text-h1 text-primary tracking-tight mb-xs">EMERALD INSTITUTIONAL</h1>
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Global Asset Management Access</p>
          </div>

          {/* Modal Content (Inputs) */}
          <form onSubmit={handleSubmit} className="px-xl pb-xl space-y-lg">
            
            {/* Error Banner */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-error-container/20 border border-error/20 rounded-lg text-error text-body-sm font-medium">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            <div className="space-y-xs">
              <label className="font-label-caps text-label-caps text-secondary uppercase" htmlFor="email">Corporate Email</label>
              <input 
                className="w-full bg-surface border border-outline-variant px-md py-md font-body-md text-on-surface focus:border-primary-container focus:ring-0 rounded-lg transition-all outline-none" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. adrian.knight@emerald.com" 
                type="email"
                required 
              />
            </div>
            
            <div className="space-y-xs">
              <div className="flex justify-between items-center">
                <label className="font-label-caps text-label-caps text-secondary uppercase" htmlFor="password">Secure Password</label>
                <button type="button" className="font-label-caps text-label-caps text-on-primary-container hover:text-primary transition-colors cursor-pointer">Forgot Credentials?</button>
              </div>
              <div className="relative">
                <input 
                  className="w-full bg-surface border border-outline-variant px-md py-md font-body-md text-on-surface focus:border-primary-container focus:ring-0 rounded-lg transition-all outline-none" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••" 
                  type={showPassword ? 'text' : 'password'}
                  required 
                />
                <button 
                  type="button"
                  className="absolute right-md top-1/2 -translate-y-1/2 text-outline-variant hover:text-secondary transition-colors cursor-pointer flex items-center justify-center" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* Primary Action */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-container text-on-primary font-label-caps text-label-caps py-lg px-xl rounded-lg flex items-center justify-between hover:bg-primary transition-all active:scale-[0.98] group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="uppercase tracking-widest">{isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <span className={`material-symbols-outlined transition-transform ${isLoading ? 'animate-spin' : 'group-hover:translate-x-1'}`}>
                {isLoading ? 'progress_activity' : 'arrow_forward'}
              </span>
            </button>
            
            {/* Identity Verification Prompt */}
            <div className="flex items-center gap-sm p-md bg-surface-container-low border border-outline-variant rounded">
              <span className="material-symbols-outlined text-on-secondary-container text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
              <p className="font-label-caps text-[10px] text-on-secondary-container leading-snug">Multi-factor authentication (MFA) will be required upon the next step for verified accounts.</p>
            </div>
          </form>

          {/* Minimal Modal Footer (Registration) */}
          <div className="bg-surface-container py-lg px-xl border-t border-outline-variant flex justify-center items-center">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">New Partner?</p>
            <button className="ml-sm font-label-caps text-label-caps text-primary hover:underline cursor-pointer transition-all">Request Institution Access</button>
          </div>
        </div>

        {/* System Status / Trust Markers */}
        <div className="mt-xl flex flex-col items-center gap-md opacity-60">
          <div className="flex items-center gap-lg">
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              <span className="font-label-caps text-[10px] uppercase tracking-tighter">256-bit AES Encrypted</span>
            </div>
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[14px]">verified_user</span>
              <span className="font-label-caps text-[10px] uppercase tracking-tighter">ISO 27001 Certified</span>
            </div>
          </div>
          <div className="w-12 h-[1px] bg-outline-variant"></div>
          <p className="font-label-caps text-[10px] text-on-surface-variant text-center leading-relaxed">
            © 2024 EMERALD INSTITUTIONAL. ALL RIGHTS RESERVED.<br/>
            SECURE ACCESS PORTAL V.4.2.0
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
