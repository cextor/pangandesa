export type OrderStatus = 
  | 'WAITING_PAYMENT_DP' 
  | 'WAITING_ADMIN_DP'
  | 'WAITING_HARVEST' 
  | 'HARVEST_CONFIRMED_SELLER'
  | 'WAITING_FINAL_PAYMENT'
  | 'WAITING_ADMIN_FINAL'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'COMPLETED';

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    unit: string;
  }[];
  totalAmount: number;
  dpAmount: number;
  remainingAmount: number;
  status: OrderStatus;
  createdAt: string;
  harvestConfirmedBySeller: boolean;
  purchaseConfirmedByBuyer: boolean;
  paymentMethod?: string;
  trackingNumber?: string;
  bastUrl?: string;
}

export interface ChatMessage {
  id: string;
  orderId?: string;
  senderId?: string;
  senderRole?: 'buyer' | 'seller' | 'admin';
  senderName?: string;
  content?: string;
  timestamp: string | number;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'file';
  role?: 'user' | 'model' | 'assistant';
  text?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  farmer: string;
  category: string;
  image: string;
  harvestDate: string;
  rating: number;
  reviewCount: number;
  stock: number;
  description: string;
  isPreOrder: boolean;
}

export interface BuyerRequest {
  id: string;
  buyerId: string;
  buyerName: string;
  panganType: string;
  quantity: number;
  unit: string;
  deliveryPeriod: string;
  status: 'OPEN' | 'TAKEN' | 'COMPLETED';
  fulfilledBy?: string;
  createdAt: string;
  budget?: number;
}

export interface Seller {
  id: string;
  name: string;
  village: string;
  totalSales: number;
  rating: number;
  products: Product[];
}

export type AppRole = 'buyer' | 'seller' | 'admin';
