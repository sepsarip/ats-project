import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as loginApi, extractAuthFromResponse } from '../services/auth';
import { setAuthHeader } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('auth');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.token) {
          setToken(parsed.token);
          setAuthHeader(parsed.token);
        }
        if (parsed?.user) setUser(parsed.user);
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  async function login(email, password) {
    setLoading(true);
    try {
      const data = await loginApi(email, password);
      const { user: u, token: t } = extractAuthFromResponse(data);
      setUser(u);
      setToken(t);
      setAuthHeader(t);
      localStorage.setItem('auth', JSON.stringify({ user: u, token: t }));
      return { user: u, token: t };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    setAuthHeader(null);
    localStorage.removeItem('auth');
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
