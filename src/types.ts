export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  farmer: string;
  village: string;
  category: string;
  image: string;
  harvestDate: string;
  rating: number;
  reviewCount: number;
  stock: number;
  description: string;
  isPreOrder: boolean;
}

export interface Seller {
  id: string;
  name: string;
  village: string;
  totalSales: number;
  rating: number;
  products: Product[];
}

export type AppRole = 'buyer' | 'seller';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
