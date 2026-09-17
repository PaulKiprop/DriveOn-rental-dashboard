import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { auth } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: { username: string; email: string; password: string; fullName: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    auth.me()
      .then(u => setUser(u as any))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await auth.login(username, password);
    setUser(res.user as any);
  };

  const register = async (data: { username: string; email: string; password: string; fullName: string }) => {
    const res = await auth.register(data);
    setUser(res.user as any);
  };

  const logout = async () => {
    await auth.logout().catch(() => {});
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
