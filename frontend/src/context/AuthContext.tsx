'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { User, LoginCredentials, RegisterCredentials, ApiError } from '@/types';
import { authService } from '@/services/authService';
import { storage } from '@/utils/storage';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = storage.getToken();
    const savedUser = storage.getUser();
    
    if (!token || !savedUser) {
      setIsLoading(false);
      return;
    }

    setUser(savedUser);
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      storage.setToken(response.data.token);
      storage.setUser(response.data.user);
      setUser(response.data.user);
      
      toast.success('Inicio de sesión exitoso');
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message = axiosError.response?.data?.message || 'Error al iniciar sesión';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      const response = await authService.register(credentials);
      
      storage.setToken(response.data.token);
      storage.setUser(response.data.user);
      setUser(response.data.user);
      
      toast.success('Registro exitoso');
      router.push('/tasks');
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message = axiosError.response?.data?.message || 'Error al registrarse';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    storage.removeToken();
    storage.removeUser();
    setUser(null);
    toast.success('Sesión cerrada');
    router.push('/login');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};