
import api from './index';
import { ProductCategory } from '@/types';

export const getProductCategories = async () => {
  const response = await api.get<ProductCategory[]>('/product-categories');
  return response.data;
};

export const getProductCategory = async (id: string) => {
  const response = await api.get<ProductCategory>(`/product-categories/${id}`);
  return response.data;
};

export const createProductCategory = async (data: Omit<ProductCategory, 'id' | 'created_at' | 'updated_at'>) => {
  const response = await api.post<ProductCategory>('/product-categories', data);
  return response.data;
};

export const updateProductCategory = async (id: string, data: Partial<Omit<ProductCategory, 'id' | 'created_at' | 'updated_at'>>) => {
  const response = await api.put<ProductCategory>(`/product-categories/${id}`, data);
  return response.data;
};

export const deleteProductCategory = async (id: string) => {
  const response = await api.delete(`/product-categories/${id}`);
  return response.data;
};

export const activateProductCategory = async (id: string) => {
  const response = await api.patch(`/product-categories/${id}/activate`);
  return response.data;
};

export const deactivateAllProductCategories = async () => {
  const response = await api.patch('/product-categories/deactivate-all');
  return response.data;
};
