export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const TASK_STATUSES = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en progreso', label: 'En Progreso' },
  { value: 'completada', label: 'Completada' },
] as const;

export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'auth_user';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  TASKS: '/tasks',
} as const;

