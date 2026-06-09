import apiClient from './apiClient';

export interface Address {
  id: string;
  userId?: string;
  type: string;
  name: string;
  phone: string;
  street: string;
  district: string;
  city: string;
  isDefault: boolean;
}

export const AddressService = {
  getAddresses: async (userId: string): Promise<Address[]> => {
    const response = await apiClient.get('/addresses', { params: { user_id: userId } });
    const data = response.data.data || [];
    return data.map((a: any) => ({
      id: String(a.id),
      userId: String(a.user_id),
      type: a.type,
      name: a.name,
      phone: a.phone,
      street: a.street,
      district: a.district,
      city: a.city,
      isDefault: a.is_default == 1 || a.is_default === true
    }));
  },

  createAddress: async (addressData: Partial<Address>): Promise<Address> => {
    const response = await apiClient.post('/addresses', {
      user_id: addressData.userId,
      type: addressData.type,
      name: addressData.name,
      phone: addressData.phone,
      street: addressData.street,
      district: addressData.district,
      city: addressData.city,
      is_default: addressData.isDefault ? 1 : 0
    });
    const a = response.data.data;
    return {
      id: String(a.id),
      userId: String(a.user_id),
      type: a.type,
      name: a.name,
      phone: a.phone,
      street: a.street,
      district: a.district,
      city: a.city,
      isDefault: a.is_default == 1 || a.is_default === true
    };
  },

  updateAddress: async (id: string, addressData: Partial<Address>): Promise<Address> => {
    const response = await apiClient.put(`/addresses/${id}`, {
      type: addressData.type,
      name: addressData.name,
      phone: addressData.phone,
      street: addressData.street,
      district: addressData.district,
      city: addressData.city,
      is_default: addressData.isDefault ? 1 : 0
    });
    const a = response.data.data;
    return {
      id: String(a.id),
      userId: String(a.user_id),
      type: a.type,
      name: a.name,
      phone: a.phone,
      street: a.street,
      district: a.district,
      city: a.city,
      isDefault: a.is_default == 1 || a.is_default === true
    };
  },

  deleteAddress: async (id: string): Promise<void> => {
    await apiClient.delete(`/addresses/${id}`);
  },

  setDefault: async (id: string): Promise<void> => {
    await apiClient.put(`/addresses/${id}/default`);
  }
};
