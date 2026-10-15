import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('findit_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const persist = (data) => {
    localStorage.setItem('findit_user', JSON.stringify(data));
    setUser(data);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persist({ ...data.user, token: data.token });
    return data;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone });
    persist({ ...data.user, token: data.token });
    return data;
  };

  const logout = useCallback(() => {
    localStorage.removeItem('findit_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updated) => {
    setUser((prev) => {
      const merged = { ...prev, ...updated };
      localStorage.setItem('findit_user', JSON.stringify(merged));
      return merged;
    });
  }, []);

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      updateUser(data.user);
    } catch (_) {}
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
