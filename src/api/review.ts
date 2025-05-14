
import api from './index';
import { UserReview } from '@/types';

export const getReviews = async (page = 1, limit = 10, search = '') => {
  const response = await api.get<{ data: UserReview[]; total: number }>('/reviews', {
    params: { page, limit, search },
  });
  return response.data;
};

export const getReview = async (id: string) => {
  const response = await api.get<UserReview>(`/reviews/${id}`);
  return response.data;
};

export const createReview = async (data: Omit<UserReview, 'id' | 'created_at' | 'updated_at'>) => {
  const response = await api.post<UserReview>('/reviews', data);
  return response.data;
};

export const updateReview = async (id: string, data: Partial<Omit<UserReview, 'id' | 'created_at' | 'updated_at'>>) => {
  const response = await api.put<UserReview>(`/reviews/${id}`, data);
  return response.data;
};

export const deleteReview = async (id: string) => {
  const response = await api.delete(`/reviews/${id}`);
  return response.data;
};
