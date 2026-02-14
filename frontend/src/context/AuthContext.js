import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));

  useEffect(() => {
    const onStorage = () => {
      setToken(localStorage.getItem('token'));
      setUserId(localStorage.getItem('userId'));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = ({ token: t, userId: u }) => {
    if (t) {
      localStorage.setItem('token', t);
      setToken(t);
    }
    if (u) {
      localStorage.setItem('userId', u);
      setUserId(u);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
    setUserId(null);
  };

  const value = {
    token,
    userId,
    isLoggedIn: !!token,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
