import { renderHook, waitFor, act } from '@testing-library/react';
import { useTasks } from '@/hooks/useTasks';
import { taskService } from '@/services/taskService';
import toast from 'react-hot-toast';
import { Task, CreateTaskData, UpdateTaskData } from '@/types';

jest.mock('@/services/taskService');
jest.mock('react-hot-toast');

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Description 1',
    status: 'pendiente',
    userId: 1,
    createdAt: '2025-11-05T00:00:00.000Z',
    updatedAt: '2025-11-05T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'Task 2',
    description: 'Description 2',
    status: 'en progreso',
    userId: 1,
    createdAt: '2025-11-05T00:00:00.000Z',
    updatedAt: '2025-11-05T00:00:00.000Z',
  },
];

describe('useTasks Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('carga tareas exitosamente', async () => {
    (taskService.getTasks as jest.Mock).mockResolvedValue(mockTasks);

    const { result } = renderHook(() => useTasks());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tasks).toEqual(mockTasks);
    expect(result.current.error).toBeNull();
  });

  it('maneja errores al cargar tareas', async () => {
    const errorMessage = 'Error al cargar las tareas';
    (taskService.getTasks as jest.Mock).mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  it('crea una tarea exitosamente', async () => {
    (taskService.getTasks as jest.Mock).mockResolvedValue([]);
    const newTask: Task = {
      id: 3,
      title: 'New Task',
      description: 'New Description',
      status: 'pendiente',
      userId: 1,
      createdAt: '2025-11-05T00:00:00.000Z',
      updatedAt: '2025-11-05T00:00:00.000Z',
    };
    (taskService.createTask as jest.Mock).mockResolvedValue(newTask);

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const createData: CreateTaskData = {
      title: 'New Task',
      description: 'New Description',
      status: 'pendiente',
    };

    await act(async () => {
      await result.current.createTask(createData);
    });

    await waitFor(() => {
      expect(result.current.tasks).toContainEqual(newTask);
    });

    expect(toast.success).toHaveBeenCalledWith('Tarea creada exitosamente');
  });

  it('maneja errores al crear tarea', async () => {
    (taskService.getTasks as jest.Mock).mockResolvedValue([]);
    const errorMessage = 'Error al crear la tarea';
    (taskService.createTask as jest.Mock).mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const createData: CreateTaskData = {
      title: 'New Task',
      description: 'New Description',
      status: 'pendiente',
    };

    await expect(
      act(async () => {
        await result.current.createTask(createData);
      })
    ).rejects.toBeDefined();

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  it('actualiza una tarea exitosamente', async () => {
    (taskService.getTasks as jest.Mock).mockResolvedValue(mockTasks);
    const updatedTask: Task = {
      ...mockTasks[0],
      title: 'Updated Task',
    };
    (taskService.updateTask as jest.Mock).mockResolvedValue(updatedTask);

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const updateData: UpdateTaskData = {
      title: 'Updated Task',
    };

    await act(async () => {
      await result.current.updateTask(1, updateData);
    });

    await waitFor(() => {
      expect(result.current.tasks[0]).toEqual(updatedTask);
    });

    expect(toast.success).toHaveBeenCalledWith('Tarea actualizada exitosamente');
  });

  it('maneja errores al actualizar tarea', async () => {
    (taskService.getTasks as jest.Mock).mockResolvedValue(mockTasks);
    const errorMessage = 'Error al actualizar la tarea';
    (taskService.updateTask as jest.Mock).mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(
      act(async () => {
        await result.current.updateTask(1, { title: 'Updated' });
      })
    ).rejects.toBeDefined();

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  it('elimina una tarea exitosamente', async () => {
    (taskService.getTasks as jest.Mock).mockResolvedValue(mockTasks);
    (taskService.deleteTask as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteTask(1);
    });

    await waitFor(() => {
      expect(result.current.tasks).not.toContainEqual(mockTasks[0]);
    });

    expect(toast.success).toHaveBeenCalledWith('Tarea eliminada exitosamente');
  });

  it('maneja errores al eliminar tarea', async () => {
    (taskService.getTasks as jest.Mock).mockResolvedValue(mockTasks);
    const errorMessage = 'Error al eliminar la tarea';
    (taskService.deleteTask as jest.Mock).mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(
      act(async () => {
        await result.current.deleteTask(1);
      })
    ).rejects.toBeDefined();

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  it('filtra tareas por estado', async () => {
    const pendienteTasks = mockTasks.filter((t) => t.status === 'pendiente');
    (taskService.getTasks as jest.Mock).mockResolvedValue(pendienteTasks);

    const { result } = renderHook(() => useTasks('pendiente'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(taskService.getTasks).toHaveBeenCalledWith('pendiente');
  });

  it('permite cambiar el filtro de estado', async () => {
    (taskService.getTasks as jest.Mock).mockResolvedValue(mockTasks);

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setStatusFilter('en progreso');
    });

    await waitFor(() => {
      expect(result.current.statusFilter).toBe('en progreso');
    });
  });
});
