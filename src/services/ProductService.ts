import apiClient from './apiClient';
import { Product } from '../types';

export const ProductService = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get('/products');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  },

  getProductById: async (id: string): Promise<Product> => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw error;
    }
  },

  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    try {
      const response = await apiClient.post('/products', productData);
      return response.data.data;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  }
};
