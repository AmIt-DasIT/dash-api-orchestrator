
import api from './index';
import { Membership } from '@/types';

export const getMemberships = async () => {
  const response = await api.get<Membership[]>('/memberships');
  return response.data;
};

export const getMembership = async (id: string) => {
  const response = await api.get<Membership>(`/memberships/${id}`);
  return response.data;
};

export const createMembership = async (data: Omit<Membership, 'id' | 'created_at' | 'updated_at'>) => {
  const response = await api.post<Membership>('/memberships', data);
  return response.data;
};

export const updateMembership = async (id: string, data: Partial<Omit<Membership, 'id' | 'created_at' | 'updated_at'>>) => {
  const response = await api.put<Membership>(`/memberships/${id}`, data);
  return response.data;
};

export const deleteMembership = async (id: string) => {
  const response = await api.delete(`/memberships/${id}`);
  return response.data;
};

export const activateMembership = async (id: string) => {
  const response = await api.patch(`/memberships/${id}/activate`);
  return response.data;
};

export const deactivateMembership = async (id: string) => {
  const response = await api.patch(`/memberships/${id}/deactivate`);
  return response.data;
};

export const deactivateAllMemberships = async () => {
  const response = await api.patch('/memberships/deactivate-all');
  return response.data;
};
