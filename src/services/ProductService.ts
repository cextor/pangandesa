import apiClient from './apiClient';
import { Product } from '../types';

export const ProductService = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get('/products');
      const data = response.data.data;
      return (data || []).map((p: any) => ({
        id: String(p.id),
        sellerId: p.seller_id,
        name: p.name,
        price: Number(p.price),
        unit: p.unit,
        farmer: p.farmer || 'Pak Joko',
        category: p.category || 'Sayur',
        image: p.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=1000&auto=format&fit=crop',
        harvestDate: p.harvest_date || p.harvestDate || '',
        rating: Number(p.rating || 0),
        reviewCount: Number(p.review_count || p.reviewCount || 0),
        stock: Number(p.stock || 0),
        description: p.description || '',
        isPreOrder: p.is_preorder == 1 || p.isPreOrder == true,
        images: p.images || [],
      }));
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  },

  getProductById: async (id: string): Promise<Product> => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      const p = response.data.data;
      return {
        id: String(p.id),
        sellerId: p.seller_id,
        name: p.name,
        price: Number(p.price),
        unit: p.unit,
        farmer: p.farmer || 'Pak Joko',
        category: p.category || 'Sayur',
        image: p.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=1000&auto=format&fit=crop',
        harvestDate: p.harvest_date || p.harvestDate || '',
        rating: Number(p.rating || 0),
        reviewCount: Number(p.review_count || p.reviewCount || 0),
        stock: Number(p.stock || 0),
        description: p.description || '',
        isPreOrder: p.is_preorder == 1 || p.isPreOrder == true,
        images: p.images || [],
      };
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw error;
    }
  },

  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    try {
      // Map category name to category_id
      let categoryId = 2; // Default Sayur
      const catName = productData.category?.toLowerCase() || '';
      if (catName.includes('beras') || catName.includes('biji')) {
        categoryId = 1;
      } else if (catName.includes('sayur')) {
        categoryId = 2;
      } else if (catName.includes('buah')) {
        categoryId = 3;
      }

      const payload = {
        seller_id: 2, // Default seller: Petani Maju has ID 2
        category_id: categoryId,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        unit: productData.unit,
        stock: productData.stock,
        is_preorder: productData.isPreOrder ? 1 : 0,
        harvest_date: productData.harvestDate || '2026-06-10',
        image: productData.image,
        images: productData.images || [],
        rating: 0,
        review_count: 0
      };

      const response = await apiClient.post('/products', payload);
      const p = response.data.data;
      
      return {
        id: String(p.id),
        sellerId: p.seller_id,
        name: p.name,
        price: Number(p.price),
        unit: p.unit,
        farmer: 'Petani Maju',
        category: productData.category || 'Sayur',
        image: p.image,
        harvestDate: p.harvest_date,
        rating: 0,
        reviewCount: 0,
        stock: Number(p.stock),
        description: p.description,
        isPreOrder: p.is_preorder == 1 || p.isPreOrder == true,
        images: p.images || [],
      };
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    try {
      // Map category name to category_id
      let categoryId = 2; // Default Sayur
      const catName = productData.category?.toLowerCase() || '';
      if (catName.includes('beras') || catName.includes('biji')) {
        categoryId = 1;
      } else if (catName.includes('sayur')) {
        categoryId = 2;
      } else if (catName.includes('buah')) {
        categoryId = 3;
      }

      const payload = {
        category_id: categoryId,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        unit: productData.unit,
        stock: productData.stock,
        is_preorder: productData.isPreOrder ? 1 : 0,
        harvest_date: productData.harvestDate || '2026-06-10',
        image: productData.image,
        images: productData.images || [],
      };

      const response = await apiClient.put(`/products/${id}`, payload);
      const p = response.data.data;

      return {
        id: String(id),
        name: productData.name || '',
        price: Number(productData.price || 0),
        unit: productData.unit || 'kg',
        farmer: 'Petani Maju',
        category: productData.category || 'Sayur',
        image: productData.image || '',
        harvestDate: productData.harvestDate || '',
        rating: 0,
        reviewCount: 0,
        stock: Number(productData.stock || 0),
        description: productData.description || '',
        isPreOrder: !!productData.isPreOrder,
        images: p.images || productData.images || [],
      };
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  },

  deleteProduct: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  }
};
