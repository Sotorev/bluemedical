'use client';

import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import { Task, TaskStatus, CreateTaskData, UpdateTaskData, ApiError } from '@/types';
import { taskService } from '@/services/taskService';
import toast from 'react-hot-toast';

export const useTasks = (initialStatus?: TaskStatus) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | undefined>(initialStatus);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await taskService.getTasks(statusFilter);
      setTasks(data);
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      const message = axiosError.response?.data?.message || 'Error al cargar las tareas';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (data: CreateTaskData) => {
    try {
      const newTask = await taskService.createTask(data);
      setTasks((prev) => [newTask, ...prev]);
      toast.success('Tarea creada exitosamente');
      return newTask;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      const message = axiosError.response?.data?.message || 'Error al crear la tarea';
      toast.error(message);
      throw err;
    }
  };

  const updateTask = async (id: number, data: UpdateTaskData) => {
    try {
      const updatedTask = await taskService.updateTask(id, data);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
      toast.success('Tarea actualizada exitosamente');
      return updatedTask;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      const message = axiosError.response?.data?.message || 'Error al actualizar la tarea';
      toast.error(message);
      throw err;
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success('Tarea eliminada exitosamente');
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      const message = axiosError.response?.data?.message || 'Error al eliminar la tarea';
      toast.error(message);
      throw err;
    }
  };

  return {
    tasks,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};

