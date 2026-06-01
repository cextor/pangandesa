import apiClient from './apiClient';
import { Promo } from '../types';

export const PromoService = {
  getAllPromos: async (): Promise<Promo[]> => {
    try {
      const response = await apiClient.get('/promos');
      const data = response.data.data;
      return (data || []).map((p: any) => ({
        id: String(p.id),
        code: p.code,
        title: p.title,
        description: p.description,
        discountPercent: Number(p.discount_percent),
        minPurchase: Number(p.min_purchase),
        image: p.image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=600'
      }));
    } catch (error) {
      console.error('Failed to fetch promos', error);
      return [];
    }
  },

  createPromo: async (promoData: Partial<Promo>): Promise<Promo> => {
    const payload = {
      code: promoData.code,
      title: promoData.title,
      description: promoData.description,
      discount_percent: promoData.discountPercent,
      min_purchase: promoData.minPurchase,
      image: promoData.image
    };
    const response = await apiClient.post('/promos', payload);
    const p = response.data.data;
    return {
      id: String(p.id),
      code: p.code,
      title: p.title,
      description: p.description,
      discountPercent: Number(p.discount_percent),
      minPurchase: Number(p.min_purchase),
      image: p.image
    };
  },

  updatePromo: async (id: string, promoData: Partial<Promo>): Promise<Promo> => {
    const payload = {
      code: promoData.code,
      title: promoData.title,
      description: promoData.description,
      discount_percent: promoData.discountPercent,
      min_purchase: promoData.minPurchase,
      image: promoData.image
    };
    const response = await apiClient.put(`/promos/${id}`, payload);
    const p = response.data.data;
    return {
      id: String(p.id),
      code: p.code,
      title: p.title,
      description: p.description,
      discountPercent: Number(p.discount_percent),
      minPurchase: Number(p.min_purchase),
      image: p.image
    };
  },

  deletePromo: async (id: string): Promise<void> => {
    await apiClient.delete(`/promos/${id}`);
  }
};
