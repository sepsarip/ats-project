import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as loginApi, extractAuthFromResponse } from '../services/auth';
import { setAuthHeader } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const initial = (() => {
    try {
      const raw = localStorage.getItem('auth');
      if (!raw) return { user: null, token: null };
      const parsed = JSON.parse(raw);
      if (parsed?.token) setAuthHeader(parsed.token);
      return { user: parsed.user || null, token: parsed.token || null };
    } catch (e) {
      return { user: null, token: null };
    }
  })();

  const [user, setUser] = useState(initial.user);
  const [token, setToken] = useState(initial.token);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setInitialized(true);
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
    <AuthContext.Provider
      value={{ user, token, loading, initialized, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
