import React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LoginPresenter } from './LoginPresenter';
import { useAuth } from '../../context/AuthContext';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Tasks: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const LoginContainer: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { login, isLoading } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      Alert.alert('Error', message);
    }
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <LoginPresenter
      onLogin={handleLogin}
      onNavigateToRegister={handleNavigateToRegister}
      isLoading={isLoading}
    />
  );
};

