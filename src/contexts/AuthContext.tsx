import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppRole } from '../types';
import { AuthService } from '../services/AuthService';
import apiClient from '../services/apiClient';

interface AuthContextType {
  isLoggedIn: boolean;
  activeRole: AppRole;
  user: any | null;
  login: (emailOrRole: string, password?: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  setActiveRole: (role: AppRole) => void;
  updateProfile: (profileData: any) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
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
    const storedUser = localStorage.getItem('user');
    if (token && role) {
      setIsLoggedIn(true);
      setActiveRoleState(role);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user", e);
        }
      }
    }
  }, []);

  const logout = useCallback(async () => {
    await AuthService.logout();
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setActiveRoleState('buyer');
  }, []);

  // Idle Timer: Logout if user is idle for 5 minutes (300,000 ms)
  useEffect(() => {
    if (!isLoggedIn) return;

    let timeoutId: any;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
      }, 5 * 60 * 1000); // 5 minutes
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Start timer on mount/login
    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isLoggedIn, logout]);

  const login = async (emailOrRole: string, password?: string) => {
    try {
      const response = await AuthService.login(emailOrRole, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.user.role);
      localStorage.setItem('user', JSON.stringify(response.user));
      setIsLoggedIn(true);
      setActiveRoleState(response.user.role);
      setUser(response.user);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const register = async (payload: any) => {
    try {
      const response = await AuthService.register(payload);
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.user.role);
      localStorage.setItem('user', JSON.stringify(response.user));
      setIsLoggedIn(true);
      setActiveRoleState(response.user.role);
      setUser(response.user);
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  };


  const setActiveRole = (role: AppRole) => {
    setActiveRoleState(role);
    localStorage.setItem('role', role);
  };

  const updateProfile = async (profileData: any) => {
    try {
      if (!user?.id) return;
      const response = await AuthService.updateProfile(user.id, profileData);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } catch (error) {
      console.error('Update profile context failed:', error);
      throw error;
    }
  };
  
  const uploadAvatar = async (file: File) => {
    try {
      if (!user?.id) return;
      const response = await AuthService.uploadAvatar(user.id, file);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } catch (error) {
      console.error('Upload avatar context failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, activeRole, user, login, register, logout, setActiveRole, updateProfile, uploadAvatar }}>
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
