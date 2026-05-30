import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { loginUser, type LoginResponse } from '../lib/api';

interface User {
  acc_id: number;
  username: string;
  email: string;
  pnumber: string | null;
  bio: string | null;
  avatar_seed: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('bacaro_token');
    const savedUser = localStorage.getItem('bacaro_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('bacaro_token');
        localStorage.removeItem('bacaro_user');
      }
    }
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const res = await loginUser(email, password);
    if (res.success && res.token) {
      localStorage.setItem('bacaro_token', res.token);
      localStorage.setItem('bacaro_user', JSON.stringify(res.data));
      setToken(res.token);
      setUser(res.data as User);
    }
    return res;
  }

  function logout() {
    localStorage.removeItem('bacaro_token');
    localStorage.removeItem('bacaro_user');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
