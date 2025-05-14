
import api from './index';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  token: string;
}

export const login = async (credentials: LoginCredentials) => {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get<LoginResponse['user']>('/auth/me');
  return response.data;
};
