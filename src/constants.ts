import { Product, BuyerRequest } from './types';
import appLogo from './logo.jpg';

export const APP_LOGO = appLogo;

export const CATEGORIES = [
  { id: '1', name: 'Sayuran', icon: 'Leaf' },
  { id: '2', name: 'Buah', icon: 'Apple' },
  { id: '3', name: 'Beras & Biji', icon: 'Wheat' },
  { id: '4', name: 'Umbi & Rimpang', icon: 'Carrot' },
  { id: '5', name: 'Rempah', icon: 'Sprout' },
  { id: '6', name: 'Olahan Desa', icon: 'Coffee' },
  { id: '7', name: 'Produk Organik', icon: 'Flower' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Tomat Segar',
    price: 16000,
    unit: 'kg',
    farmer: 'Pak Joko',
    category: 'Sayuran',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=1000&auto=format&fit=crop',
    harvestDate: '10 Mei 2024',
    rating: 4.8,
    reviewCount: 120,
    stock: 50,
    description: 'Tomat segar pilihan dari kebun mitra, dipanen saat sudah matang sempurna.',
    isPreOrder: true,
  },
  {
    id: 'p2',
    name: 'Cabai Merah Keriting',
    price: 28000,
    unit: 'kg',
    farmer: 'Ibu Siti',
    category: 'Sayuran',
    image: 'https://images.unsplash.com/photo-1618161546200-5047b11933c0?q=80&w=1000&auto=format&fit=crop',
    harvestDate: '12 Mei 2024',
    rating: 4.9,
    reviewCount: 98,
    stock: 20,
    description: 'Cabai merah keriting organik, pedas mantap dan segar.',
    isPreOrder: true,
  },
  {
    id: 'p3',
    name: 'Beras Merah Organik',
    price: 22000,
    unit: 'kg',
    farmer: 'Bapak Ahmad',
    category: 'Beras & Biji',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1000&auto=format&fit=crop',
    harvestDate: '15 Mei 2024',
    rating: 4.7,
    reviewCount: 76,
    stock: 100,
    description: 'Beras merah organik tanpa pestisida, kaya serat dan sehat.',
    isPreOrder: true,
  },
  {
    id: 'p4',
    name: 'Jagung Manis',
    price: 9500,
    unit: 'kg',
    farmer: 'Kang Budi',
    category: 'Sayuran',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1000&auto=format&fit=crop',
    harvestDate: '11 Mei 2024',
    rating: 4.7,
    reviewCount: 64,
    stock: 30,
    description: 'Jagung manis segar dipetik langsung saat dipesan.',
    isPreOrder: true,
  },
];

export const MOCK_BUYER_REQUESTS: BuyerRequest[] = [
  {
    id: 'req1',
    buyerId: 'user-1',
    buyerName: 'Budi Santoso',
    panganType: 'Kentang Granola',
    quantity: 500,
    unit: 'kg',
    deliveryPeriod: 'Juni 2024',
    status: 'OPEN',
    createdAt: '1 Mei 2024',
    budget: 12000
  },
  {
    id: 'req2',
    buyerId: 'user-1',
    buyerName: 'Budi Santoso',
    panganType: 'Bawang Merah',
    quantity: 200,
    unit: 'kg',
    deliveryPeriod: 'Akhir Mei 2024',
    status: 'OPEN',
    createdAt: '3 Mei 2024',
    budget: 25000
  }
];
