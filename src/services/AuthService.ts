import apiClient from './apiClient';
import { AppRole } from '../types';

export const AuthService = {
  login: async (role: AppRole): Promise<{ token: string; user: any }> => {
    try {
      // Backend CI4 kita sudah disetting untuk menerima 'role' dan otomatis login
      // ke akun dummy (Admin, Petani, Pembeli) berdasarkan parameter role ini.
      const response = await apiClient.post('/auth/login', { role });
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
