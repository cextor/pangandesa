import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, ChatMessage } from '../types';
import { OrderService } from '../services/OrderService';
import { ChatService } from '../services/ChatService';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  ordersLoaded: boolean;
  messages: ChatMessage[];
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string, paymentProof?: string) => Promise<void>;
  sendMessage: (orderId: string, content: string, role: string, attachmentType?: 'image' | 'file') => Promise<void>;
  loadChatMessages: (orderId: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { user, activeRole } = useAuth();

  useEffect(() => {
    if (user) {
      setOrdersLoaded(false);
      OrderService.getOrders(user.id, activeRole).then(data => {
        setOrders(data);
        setOrdersLoaded(true);
      });
    } else {
      setOrders([]);
      setOrdersLoaded(false);
    }
  }, [user, activeRole]);

  const addOrder = async (order: Order) => {
    const newOrder = await OrderService.createOrder(order);
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = async (orderId: string, status: string, paymentProof?: string) => {
    await OrderService.updateOrderStatus(orderId, status, paymentProof);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as any, paymentProof: paymentProof || o.paymentProof } : o));
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
    <OrderContext.Provider value={{ orders, ordersLoaded, messages, addOrder, updateOrderStatus, sendMessage, loadChatMessages }}>
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
