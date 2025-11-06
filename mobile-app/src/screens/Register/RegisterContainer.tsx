import React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RegisterPresenter } from './RegisterPresenter';
import { useAuth } from '../../context/AuthContext';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Tasks: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const RegisterContainer: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { register, isLoading } = useAuth();

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      await register({ name, email, password });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al registrarse';
      Alert.alert('Error', message);
    }
  };

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <RegisterPresenter
      onRegister={handleRegister}
      onNavigateToLogin={handleNavigateToLogin}
      isLoading={isLoading}
    />
  );
};

