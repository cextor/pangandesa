import apiClient from './apiClient';

export interface NotificationItem {
  id: string | number;
  user_id: string | number;
  title: string;
  message: string;
  type: 'pre_order' | 'harvest_warning' | 'finance' | 'system';
  is_read: boolean | number;
  created_at?: string;
}

export const NotificationService = {
  getNotifications: async (userId: string | number): Promise<NotificationItem[]> => {
    try {
      const response = await apiClient.get('/notifications', {
        params: { user_id: userId }
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }
  },

  markAsRead: async (notifId: string | number): Promise<boolean> => {
    try {
      await apiClient.put(`/notifications/${notifId}/read`);
      return true;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return false;
    }
  },

  markAllAsRead: async (userId: string | number): Promise<boolean> => {
    try {
      const response = await apiClient.put('/notifications/read-all', null, {
        params: { user_id: userId }
      });
      return true;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return false;
    }
  },

  createNotification: async (notifData: Omit<NotificationItem, 'id' | 'is_read'>): Promise<NotificationItem | null> => {
    try {
      const response = await apiClient.post('/notifications', notifData);
      return response.data.data;
    } catch (error) {
      console.error('Failed to create notification:', error);
      return null;
    }
  }
};
