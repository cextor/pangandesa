import apiClient from './apiClient';
import { ChatMessage } from '../types';

const mapMessage = (m: any): ChatMessage => {
  let timeStr = '';
  try {
    if (m.created_at) {
      // Replacing dashes with slashes is safer for cross-browser Date parsing
      const cleanDate = m.created_at.replace(/-/g, '/');
      timeStr = new Date(cleanDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } else {
      timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }
  } catch (e) {
    timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }

  return {
    id: String(m.id),
    orderId: m.order_id,
    senderId: String(m.sender_id),
    senderRole: m.sender_role,
    senderName: m.sender_name,
    content: m.content,
    timestamp: timeStr,
    attachmentUrl: m.attachment_url,
    attachmentType: m.attachment_type === 'none' ? undefined : m.attachment_type
  };
};

export const ChatService = {
  getByOrder: async (orderId: string): Promise<ChatMessage[]> => {
    try {
      const response = await apiClient.get(`/chats/order/${orderId}`);
      return (response.data.data || []).map(mapMessage);
    } catch (error) {
      console.error('Failed to get chat messages', error);
      return [];
    }
  },

  sendMessage: async (messageData: Partial<ChatMessage>): Promise<ChatMessage> => {
    const response = await apiClient.post('/chats', messageData);
    return mapMessage(response.data.data);
  }
};

