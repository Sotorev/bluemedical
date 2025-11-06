import React, { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { TasksPresenter } from './TasksPresenter';
import { useAuth } from '../../context/AuthContext';
import { taskService } from '../../services/taskService';
import { Task, TaskStatus } from '../../types';

export const TasksContainer: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | ''>('');
  const { logout } = useAuth();

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const tasksData = await taskService.getTasks();
      setTasks(tasksData);
      setFilteredTasks(tasksData);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al cargar las tareas';
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    if (filterStatus) {
      setFilteredTasks(tasks.filter((task) => task.status === filterStatus));
    } else {
      setFilteredTasks(tasks);
    }
  }, [filterStatus, tasks]);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await loadTasks();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleFilterChange = (status: TaskStatus | '') => {
    setFilterStatus(status);
  };

  const handleOpenCreateModal = () => {
    setSelectedTask(null);
    setIsModalVisible(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedTask(null);
  };

  const handleCreateTask = async (data: {
    title: string;
    description: string;
    status: TaskStatus;
  }) => {
    try {
      setIsLoading(true);
      const newTask = await taskService.createTask(data);
      setTasks([newTask, ...tasks]);
      handleCloseModal();
      Alert.alert('Éxito', 'Tarea creada correctamente');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al crear la tarea';
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (data: {
    title: string;
    description: string;
    status: TaskStatus;
  }) => {
    if (!selectedTask) return;

    try {
      setIsLoading(true);
      const updatedTask = await taskService.updateTask(selectedTask.id, data);
      setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
      handleCloseModal();
      Alert.alert('Éxito', 'Tarea actualizada correctamente');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al actualizar la tarea';
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = (id: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar esta tarea?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await taskService.deleteTask(id);
              setTasks(tasks.filter((task) => task.id !== id));
              Alert.alert('Éxito', 'Tarea eliminada correctamente');
            } catch (error: any) {
              const message =
                error.response?.data?.message || 'Error al eliminar la tarea';
              Alert.alert('Error', message);
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  return (
    <TasksPresenter
      tasks={tasks}
      filteredTasks={filteredTasks}
      selectedTask={selectedTask}
      isModalVisible={isModalVisible}
      isLoading={isLoading}
      isRefreshing={isRefreshing}
      filterStatus={filterStatus}
      onFilterChange={handleFilterChange}
      onOpenCreateModal={handleOpenCreateModal}
      onOpenEditModal={handleOpenEditModal}
      onCloseModal={handleCloseModal}
      onCreateTask={handleCreateTask}
      onUpdateTask={handleUpdateTask}
      onDeleteTask={handleDeleteTask}
      onRefresh={handleRefresh}
      onLogout={handleLogout}
    />
  );
};

