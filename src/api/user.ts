
import api from './index';
import { SiteUser, CreateUserDto, UpdateUserDto } from '@/types';

export const getUsers = async () => {
  const response = await api.get<SiteUser[]>('/users');
  return response.data;
};

export const getUser = async (id: string) => {
  const response = await api.get<SiteUser>(`/users/${id}`);
  return response.data;
};

export const createUser = async (data: CreateUserDto) => {
  const response = await api.post<SiteUser>('/users', data);
  return response.data;
};

export const updateUser = async (id: string, data: UpdateUserDto) => {
  const response = await api.put<SiteUser>(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const activateUser = async (id: string) => {
  const response = await api.patch(`/users/${id}/activate`);
  return response.data;
};

export const deactivateUser = async (id: string) => {
  const response = await api.patch(`/users/${id}/deactivate`);
  return response.data;
};

export const deactivateAllUsers = async () => {
  const response = await api.patch('/users/deactivate-all');
  return response.data;
};
