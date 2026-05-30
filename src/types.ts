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
  createdAtRaw?: string;
  buyerName?: string;
  buyerVillage?: string;
  buyerAddress?: string;
  sellerName?: string;
  sellerVillage?: string;
  sellerAddress?: string;
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

export interface HarvestSchedule {
  date: string;
  status: string;
  actualDate?: string;
  stock: number;
  price: number;
  isPreOrder: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedHarvestDate?: string;
}

export interface ProductImage {
  id?: string;
  productId?: string;
  imagePath: string;
  isMain: boolean;
}

export interface Product {
  id: string;
  sellerId?: string | number;
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
  images?: ProductImage[];
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
