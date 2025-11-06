export const API_BASE_URL = 'http://192.168.0.3:3001/api';

export const TASK_STATUSES = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en progreso', label: 'En Progreso' },
  { value: 'completada', label: 'Completada' },
] as const;

export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'auth_user';

export const COLORS = {
  primary: '#3B82F6',
  secondary: '#6B7280',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  blue: {
    100: '#DBEAFE',
    600: '#2563EB',
    700: '#1D4ED8',
  },
  yellow: {
    100: '#FEF3C7',
    800: '#92400E',
  },
  green: {
    100: '#D1FAE5',
    800: '#065F46',
  },
} as const;

