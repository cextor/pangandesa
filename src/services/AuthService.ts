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
  },

  register: async (payload: any): Promise<{ token: string; user: any }> => {
    try {
      const response = await apiClient.post('/auth/register', payload);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  checkEmail: async (email: string): Promise<{ exists: boolean; message: string }> => {
    try {
      const response = await apiClient.post('/auth/check-email', { email });
      return response.data;
    } catch (error) {
      console.error('Check email failed:', error);
      throw error;
    }
  },

  updateProfile: async (userId: string | number, profileData: any): Promise<any> => {
    try {
      const response = await apiClient.put(`/auth/profile/${userId}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile failed:', error);
      throw error;
    }
  },

  changePassword: async (userId: string | number, payload: any): Promise<any> => {
    try {
      const response = await apiClient.put(`/auth/change-password/${userId}`, payload);
      return response.data;
    } catch (error) {
      console.error('Change password failed:', error);
      throw error;
    }
  },

  changePin: async (userId: string | number, pin: string): Promise<any> => {
    try {
      const response = await apiClient.put(`/auth/change-pin/${userId}`, { pin });
      return response.data;
    } catch (error) {
      console.error('Change PIN failed:', error);
      throw error;
    }
  },

  uploadAvatar: async (userId: string | number, file: File): Promise<any> => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await apiClient.post(`/auth/upload-avatar/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Upload avatar failed:', error);
      throw error;
    }
  }
};
