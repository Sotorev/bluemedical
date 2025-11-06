import { TaskRepository } from '../repositories/TaskRepository';
import { CreateTaskDto, UpdateTaskDto, TaskResponseDto } from '../dtos/task.dto';
import { Task, TaskStatus } from '../entities/Task';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async getAllTasksByUser(userId: number, status?: TaskStatus): Promise<TaskResponseDto[]> {
    let tasks: Task[];

    if (status) {
      tasks = await this.taskRepository.findByUserIdAndStatus(userId, status);
    } else {
      tasks = await this.taskRepository.findByUserId(userId);
    }

    return tasks.map(this.mapTaskToResponse);
  }

  async getTaskById(taskId: number, userId: number): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new Error('Tarea no encontrada');
    }

    if (task.userId !== userId) {
      throw new Error('No tienes permiso para acceder a esta tarea');
    }

    return this.mapTaskToResponse(task);
  }

  async createTask(createTaskDto: CreateTaskDto, userId: number): Promise<TaskResponseDto> {
    const task = await this.taskRepository.create({
      ...createTaskDto,
      userId,
      status: createTaskDto.status || TaskStatus.PENDING,
    });

    return this.mapTaskToResponse(task);
  }

  async updateTask(
    taskId: number,
    updateTaskDto: UpdateTaskDto,
    userId: number
  ): Promise<TaskResponseDto> {
    // Verificar que la tarea existe y pertenece al usuario
    const existingTask = await this.taskRepository.findById(taskId);

    if (!existingTask) {
      throw new Error('Tarea no encontrada');
    }

    if (existingTask.userId !== userId) {
      throw new Error('No tienes permiso para actualizar esta tarea');
    }

    const updatedTask = await this.taskRepository.update(taskId, updateTaskDto);

    if (!updatedTask) {
      throw new Error('Error al actualizar la tarea');
    }

    return this.mapTaskToResponse(updatedTask);
  }

  async deleteTask(taskId: number, userId: number): Promise<void> {
    // Verificar que la tarea existe y pertenece al usuario
    const existingTask = await this.taskRepository.findById(taskId);

    if (!existingTask) {
      throw new Error('Tarea no encontrada');
    }

    if (existingTask.userId !== userId) {
      throw new Error('No tienes permiso para eliminar esta tarea');
    }

    const deleted = await this.taskRepository.delete(taskId);

    if (!deleted) {
      throw new Error('Error al eliminar la tarea');
    }
  }

  private mapTaskToResponse(task: Task): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      userId: task.userId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}

