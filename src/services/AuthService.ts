import apiClient from './apiClient';
import { AppRole } from '../types';

export const AuthService = {
  login: async (emailOrRole: string, password?: string): Promise<{ token: string; user: any }> => {
    try {
      // Mendukung login dengan email+password nyata atau parameter role (untuk demo)
      const payload = password ? { email: emailOrRole, password } : { role: emailOrRole };
      const response = await apiClient.post('/auth/login', payload);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
  }
};
