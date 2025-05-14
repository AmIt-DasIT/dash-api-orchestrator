
import api from './index';
import { Product, CreateProductDto, UpdateProductDto } from '@/types';

export const getProducts = async () => {
  const response = await api.get<Product[]>('/products');
  return response.data;
};

export const getProduct = async (id: string) => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data: CreateProductDto) => {
  const response = await api.post<Product>('/products', data);
  return response.data;
};

export const updateProduct = async (id: string, data: UpdateProductDto) => {
  const response = await api.put<Product>(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const activateProduct = async (id: string) => {
  const response = await api.patch(`/products/${id}/activate`);
  return response.data;
};

export const deactivateProduct = async (id: string) => {
  const response = await api.patch(`/products/${id}/deactivate`);
  return response.data;
};

export const deactivateAllProducts = async () => {
  const response = await api.patch('/products/deactivate-all');
  return response.data;
};
