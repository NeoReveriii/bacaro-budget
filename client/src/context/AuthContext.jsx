import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem('bbm_user');
      return s && s !== 'undefined' ? JSON.parse(s) : null;
    } catch { return null; }
  });

  const [token, setTokenState] = useState(() => localStorage.getItem('bbm_token'));

  const login = useCallback((tok, userData) => {
    localStorage.setItem('bbm_token', tok);
    localStorage.setItem('bbm_user', JSON.stringify(userData));
    setTokenState(tok);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('bbm_token');
    localStorage.removeItem('bbm_user');
    setTokenState(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((userData) => {
    localStorage.setItem('bbm_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
