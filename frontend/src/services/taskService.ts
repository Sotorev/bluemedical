import axiosInstance from '@/api/axios';
import {
  Task,
  TaskResponse,
  TasksResponse,
  CreateTaskData,
  UpdateTaskData,
  TaskStatus,
} from '@/types';

export const taskService = {
  getTasks: async (status?: TaskStatus): Promise<Task[]> => {
    const params = status ? { status } : {};
    const response = await axiosInstance.get<TasksResponse>('/tasks', {
      params,
    });
    return response.data.data;
  },

  getTaskById: async (id: number): Promise<Task> => {
    const response = await axiosInstance.get<TaskResponse>(`/tasks/${id}`);
    return response.data.data;
  },

  createTask: async (data: CreateTaskData): Promise<Task> => {
    const response = await axiosInstance.post<TaskResponse>('/tasks', data);
    return response.data.data;
  },

  updateTask: async (id: number, data: UpdateTaskData): Promise<Task> => {
    const response = await axiosInstance.put<TaskResponse>(
      `/tasks/${id}`,
      data
    );
    return response.data.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/tasks/${id}`);
  },
};

