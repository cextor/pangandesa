import apiClient from './apiClient';
import { Order } from '../types';

export const OrderService = {
  getOrders: async (userId?: string, role?: string): Promise<Order[]> => {
    try {
      const response = await apiClient.get('/orders', {
        params: { user_id: userId, role }
      });
      const data = response.data.data;
      return (data || []).map((o: any) => ({
        id: o.id,
        buyerId: String(o.buyer_id),
        sellerId: String(o.seller_id),
        buyerName: o.buyer_name || 'Pembeli Umum',
        buyerVillage: o.buyer_village || o.buyer_address || 'Sukamaju',
        buyerAddress: o.buyer_address,
        sellerName: o.seller_name || 'Penjual Desa',
        sellerVillage: o.seller_village || 'Sukamaju',
        sellerAddress: o.seller_address,
        totalAmount: Number(o.total_amount),
        dpAmount: Number(o.dp_amount),
        remainingAmount: Number(o.remaining_amount),
        status: o.status,
        createdAt: o.created_at ? new Date(o.created_at).toLocaleDateString('id-ID') : new Date().toLocaleDateString('id-ID'),
        createdAtRaw: o.created_at || new Date().toISOString(),
        harvestConfirmedBySeller: o.harvest_confirmed_seller == 1,
        purchaseConfirmedByBuyer: o.purchase_confirmed_buyer == 1,
        paymentMethod: o.payment_method,
        trackingNumber: o.tracking_number,
        bastUrl: o.bast_url,
        paymentProof: o.payment_proof,
        shippingAddress: o.shipping_address,
        items: (o.items || []).map((item: any) => ({
          productId: String(item.product_id),
          name: item.name,
          quantity: Number(item.quantity),
          price: Number(item.price),
          image: item.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=1000&auto=format&fit=crop',
          unit: item.unit
        }))
      }));
    } catch (error) {
      console.error('Failed to get orders', error);
      return [];
    }
  },

  createOrder: async (orderData: Partial<Order>): Promise<Order> => {
    // Map camelCase to snake_case payload
    const payload = {
      id: orderData.id,
      buyerId: orderData.buyerId,
      sellerId: orderData.sellerId,
      totalAmount: orderData.totalAmount,
      dpAmount: orderData.dpAmount,
      remainingAmount: orderData.remainingAmount,
      shipping_address: orderData.shippingAddress,
      items: (orderData.items || []).map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        unit: item.unit,
        image: item.image
      }))
    };
    const response = await apiClient.post('/orders', payload);
    const o = response.data.data;
    
    // Map back
    return {
      id: o.id,
      buyerId: String(o.buyer_id),
      sellerId: String(o.seller_id),
      totalAmount: Number(o.total_amount),
      dpAmount: Number(o.dp_amount),
      remainingAmount: Number(o.remaining_amount),
      status: o.status,
      shippingAddress: o.shipping_address,
      createdAt: new Date().toLocaleDateString('id-ID'),
      createdAtRaw: o.created_at || new Date().toISOString(),
      harvestConfirmedBySeller: false,
      purchaseConfirmedByBuyer: false,
      items: orderData.items || []
    };
  },

  updateOrderStatus: async (orderId: string, status: string, paymentProof?: string): Promise<void> => {
    await apiClient.post(`/orders/${orderId}/status`, { status, payment_proof: paymentProof });
  }
};
