import apiClient from './apiClient';
import { ChatMessage } from '../types';

export const ChatService = {
  getByOrder: async (orderId: string): Promise<ChatMessage[]> => {
    try {
      const response = await apiClient.get(`/chats/order/${orderId}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to get chat messages', error);
      return [];
    }
  },

  sendMessage: async (messageData: Partial<ChatMessage>): Promise<ChatMessage> => {
    const response = await apiClient.post('/chats', messageData);
    return response.data.data;
  }
};
