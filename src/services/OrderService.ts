import apiClient from './apiClient';
import { Order } from '../types';

export const OrderService = {
  getOrders: async (userId?: string, role?: string): Promise<Order[]> => {
    try {
      const response = await apiClient.get('/orders', {
        params: { user_id: userId, role }
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to get orders', error);
      return [];
    }
  },

  createOrder: async (orderData: Partial<Order>): Promise<Order> => {
    const response = await apiClient.post('/orders', orderData);
    return response.data.data;
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<void> => {
    await apiClient.put(`/orders/${orderId}/status`, { status });
  }
};
