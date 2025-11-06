import { TaskService } from '../../src/services/TaskService';
import { TaskRepository } from '../../src/repositories/TaskRepository';
import { TaskStatus } from '../../src/entities/Task';

jest.mock('../../src/repositories/TaskRepository');

describe('TaskService', () => {
  let taskService: TaskService;
  let mockTaskRepository: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    mockTaskRepository = new TaskRepository() as jest.Mocked<TaskRepository>;
    taskService = new TaskService();
    (taskService as any).taskRepository = mockTaskRepository;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('debería crear una tarea exitosamente', async () => {
      const createTaskDto = {
        title: 'Nueva tarea',
        description: 'Descripción de la tarea',
      };

      const mockTask = {
        id: 1,
        ...createTaskDto,
        status: TaskStatus.PENDING,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;

      mockTaskRepository.create.mockResolvedValue(mockTask);

      const result = await taskService.createTask(createTaskDto, 1);

      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        ...createTaskDto,
        userId: 1,
        status: TaskStatus.PENDING,
      });
      expect(result.title).toBe(createTaskDto.title);
      expect(result.status).toBe(TaskStatus.PENDING);
    });
  });

  describe('getAllTasksByUser', () => {
    it('debería obtener todas las tareas del usuario', async () => {
      const mockTasks = [
        {
          id: 1,
          title: 'Tarea 1',
          description: 'Descripción 1',
          status: TaskStatus.PENDING,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Tarea 2',
          description: 'Descripción 2',
          status: TaskStatus.COMPLETED,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as any[];

      mockTaskRepository.findByUserId.mockResolvedValue(mockTasks);

      const result = await taskService.getAllTasksByUser(1);

      expect(mockTaskRepository.findByUserId).toHaveBeenCalledWith(1);
      expect(result).toHaveLength(2);
    });

    it('debería filtrar tareas por estado', async () => {
      const mockTasks = [
        {
          id: 1,
          title: 'Tarea pendiente',
          description: 'Descripción',
          status: TaskStatus.PENDING,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as any[];

      mockTaskRepository.findByUserIdAndStatus.mockResolvedValue(mockTasks);

      const result = await taskService.getAllTasksByUser(1, TaskStatus.PENDING);

      expect(mockTaskRepository.findByUserIdAndStatus).toHaveBeenCalledWith(
        1,
        TaskStatus.PENDING
      );
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe(TaskStatus.PENDING);
    });
  });

  describe('updateTask', () => {
    it('debería actualizar una tarea exitosamente', async () => {
      const updateTaskDto = {
        title: 'Tarea actualizada',
        status: TaskStatus.COMPLETED,
      };

      const mockExistingTask = {
        id: 1,
        title: 'Tarea original',
        description: 'Descripción',
        status: TaskStatus.PENDING,
        userId: 1,
      } as any;

      const mockUpdatedTask = {
        ...mockExistingTask,
        ...updateTaskDto,
      } as any;

      mockTaskRepository.findById.mockResolvedValue(mockExistingTask);
      mockTaskRepository.update.mockResolvedValue(mockUpdatedTask);

      const result = await taskService.updateTask(1, updateTaskDto, 1);

      expect(mockTaskRepository.findById).toHaveBeenCalledWith(1);
      expect(mockTaskRepository.update).toHaveBeenCalledWith(1, updateTaskDto);
      expect(result.title).toBe(updateTaskDto.title);
    });

    it('debería lanzar error si la tarea no existe', async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      await expect(
        taskService.updateTask(999, { title: 'Test' }, 1)
      ).rejects.toThrow('Tarea no encontrada');
    });

    it('debería lanzar error si el usuario no es el propietario', async () => {
      const mockTask = {
        id: 1,
        userId: 2, // Diferente al userId proporcionado
      } as any;

      mockTaskRepository.findById.mockResolvedValue(mockTask);

      await expect(
        taskService.updateTask(1, { title: 'Test' }, 1)
      ).rejects.toThrow('No tienes permiso para actualizar esta tarea');
    });
  });

  describe('deleteTask', () => {
    it('debería eliminar una tarea exitosamente', async () => {
      const mockTask = {
        id: 1,
        userId: 1,
      } as any;

      mockTaskRepository.findById.mockResolvedValue(mockTask);
      mockTaskRepository.delete.mockResolvedValue(true);

      await taskService.deleteTask(1, 1);

      expect(mockTaskRepository.findById).toHaveBeenCalledWith(1);
      expect(mockTaskRepository.delete).toHaveBeenCalledWith(1);
    });

    it('debería lanzar error si la tarea no existe', async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      await expect(taskService.deleteTask(999, 1)).rejects.toThrow('Tarea no encontrada');
    });

    it('debería lanzar error si el usuario no es el propietario', async () => {
      const mockTask = {
        id: 1,
        userId: 2,
      } as any;

      mockTaskRepository.findById.mockResolvedValue(mockTask);

      await expect(taskService.deleteTask(1, 1)).rejects.toThrow(
        'No tienes permiso para eliminar esta tarea'
      );
    });
  });
});

