import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, ChatMessage } from '../types';
import { OrderService } from '../services/OrderService';
import { ChatService } from '../services/ChatService';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  messages: ChatMessage[];
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  sendMessage: (orderId: string, content: string, role: string, attachmentType?: 'image' | 'file') => Promise<void>;
  loadChatMessages: (orderId: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { user, activeRole } = useAuth();

  useEffect(() => {
    if (user) {
      OrderService.getOrders(user.id, activeRole).then(setOrders);
    } else {
      setOrders([]);
    }
  }, [user, activeRole]);

  const addOrder = async (order: Order) => {
    const newOrder = await OrderService.createOrder(order);
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await OrderService.updateOrderStatus(orderId, status);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as any } : o));
  };

  const loadChatMessages = async (orderId: string) => {
    const msgs = await ChatService.getByOrder(orderId);
    setMessages(msgs);
  };

  const sendMessage = async (orderId: string, content: string, role: string, attachmentType?: 'image' | 'file') => {
    const newMessage = await ChatService.sendMessage({
      orderId,
      senderId: user?.id,
      content,
      attachmentType
    });
    // Optimistic UI update or just wait for response
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <OrderContext.Provider value={{ orders, messages, addOrder, updateOrderStatus, sendMessage, loadChatMessages }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
