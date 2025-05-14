
import api from './index';
import { ProductItem } from '@/types';

export const getProductItems = async () => {
  const response = await api.get<ProductItem[]>('/product-items');
  return response.data;
};

export const getProductItem = async (id: string) => {
  const response = await api.get<ProductItem>(`/product-items/${id}`);
  return response.data;
};

export const createProductItem = async (data: Omit<ProductItem, 'id' | 'created_at' | 'updated_at'>) => {
  const response = await api.post<ProductItem>('/product-items', data);
  return response.data;
};

export const updateProductItem = async (id: string, data: Partial<Omit<ProductItem, 'id' | 'created_at' | 'updated_at'>>) => {
  const response = await api.put<ProductItem>(`/product-items/${id}`, data);
  return response.data;
};

export const deleteProductItem = async (id: string) => {
  const response = await api.delete(`/product-items/${id}`);
  return response.data;
};

export const activateProductItem = async (id: string) => {
  const response = await api.patch(`/product-items/${id}/activate`);
  return response.data;
};

export const deactivateAllProductItems = async () => {
  const response = await api.patch('/product-items/deactivate-all');
  return response.data;
};
