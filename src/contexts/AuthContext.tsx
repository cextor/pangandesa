import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppRole } from '../types';
import { AuthService } from '../services/AuthService';
import apiClient from '../services/apiClient';

interface AuthContextType {
  isLoggedIn: boolean;
  activeRole: AppRole;
  user: any | null;
  login: (emailOrRole: string, password?: string) => Promise<void>;
  logout: () => void;
  setActiveRole: (role: AppRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeRole, setActiveRoleState] = useState<AppRole>('buyer');
  const [user, setUser] = useState<any | null>(null);

  // Initialize from localStorage if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role') as AppRole;
    if (token && role) {
      setIsLoggedIn(true);
      setActiveRoleState(role);
      // Ideally, fetch user profile here
    }
  }, []);

  const login = async (emailOrRole: string, password?: string) => {
    try {
      const response = await AuthService.login(emailOrRole, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.user.role);
      setIsLoggedIn(true);
      setActiveRoleState(response.user.role);
      setUser(response.user);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const logout = async () => {
    await AuthService.logout();
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUser(null);
    setActiveRoleState('buyer');
  };

  const setActiveRole = (role: AppRole) => {
    setActiveRoleState(role);
    localStorage.setItem('role', role);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, activeRole, user, login, logout, setActiveRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
