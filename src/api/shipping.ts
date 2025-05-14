
import api from './index';
import { ShippingMethod } from '@/types';

export const getShippingMethods = async (page = 1, limit = 10, search = '') => {
  const response = await api.get<{ data: ShippingMethod[]; total: number }>('/shipping', {
    params: { page, limit, search },
  });
  return response.data;
};

export const getShippingMethod = async (id: string) => {
  const response = await api.get<ShippingMethod>(`/shipping/${id}`);
  return response.data;
};

export const createShippingMethod = async (data: Omit<ShippingMethod, 'id' | 'created_at' | 'updated_at'>) => {
  const response = await api.post<ShippingMethod>('/shipping', data);
  return response.data;
};

export const updateShippingMethod = async (id: string, data: Partial<Omit<ShippingMethod, 'id' | 'created_at' | 'updated_at'>>) => {
  const response = await api.put<ShippingMethod>(`/shipping/${id}`, data);
  return response.data;
};

export const deleteShippingMethod = async (id: string) => {
  const response = await api.delete(`/shipping/${id}`);
  return response.data;
};
