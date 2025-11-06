export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'pendiente' | 'en progreso' | 'completada';

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface TaskResponse {
  success: boolean;
  message: string;
  data: Task;
}

export interface TasksResponse {
  success: boolean;
  message: string;
  data: Task[];
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  status: TaskStatus;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

