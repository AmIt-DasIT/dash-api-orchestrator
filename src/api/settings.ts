
import api from './index';

export interface AppSettings {
  id: string;
  siteName: string;
  logoUrl: string;
  primaryColor: string;
  contactEmail: string;
  currencySymbol: string;
  taxRate: number;
  created_at: string;
  updated_at: string;
}

export const getSettings = async () => {
  const response = await api.get<AppSettings>('/settings');
  return response.data;
};

export const updateSettings = async (data: Partial<Omit<AppSettings, 'id' | 'created_at' | 'updated_at'>>) => {
  const response = await api.put<AppSettings>('/settings', data);
  return response.data;
};
