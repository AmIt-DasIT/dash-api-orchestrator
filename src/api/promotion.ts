
import api from './index';
import { Promotion } from '@/types';

export const getPromotions = async (page = 1, limit = 10, search = '') => {
  const response = await api.get<{ data: Promotion[]; total: number }>('/promotions', {
    params: { page, limit, search },
  });
  return response.data;
};

export const getPromotion = async (id: string) => {
  const response = await api.get<Promotion>(`/promotions/${id}`);
  return response.data;
};

export const createPromotion = async (data: Omit<Promotion, 'id' | 'created_at' | 'updated_at'>) => {
  const response = await api.post<Promotion>('/promotions', data);
  return response.data;
};

export const updatePromotion = async (id: string, data: Partial<Omit<Promotion, 'id' | 'created_at' | 'updated_at'>>) => {
  const response = await api.put<Promotion>(`/promotions/${id}`, data);
  return response.data;
};

export const deletePromotion = async (id: string) => {
  const response = await api.delete(`/promotions/${id}`);
  return response.data;
};
