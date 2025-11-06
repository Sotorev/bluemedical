import axiosInstance from '@/api/axios';
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from '@/types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      '/auth/register',
      credentials
    );
    return response.data;
  },
};

