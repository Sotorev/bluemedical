import { Response } from 'express';
import { TaskService } from '../services/TaskService';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';
import { AuthRequest } from '../middlewares/authMiddleware';
import { TaskStatus } from '../entities/Task';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  getAllTasks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId!;
      const status = req.query.status as TaskStatus | undefined;

      const tasks = await this.taskService.getAllTasksByUser(userId, status);

      res.status(200).json({
        success: true,
        message: 'Tareas obtenidas exitosamente',
        data: tasks,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al obtener tareas',
        });
      }
    }
  };

  getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId!;
      const taskId = parseInt(req.params.id);

      if (isNaN(taskId)) {
        res.status(400).json({
          success: false,
          message: 'ID de tarea inválido',
        });
        return;
      }

      const task = await this.taskService.getTaskById(taskId, userId);

      res.status(200).json({
        success: true,
        message: 'Tarea obtenida exitosamente',
        data: task,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al obtener tarea',
        });
      }
    }
  };

  createTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId!;
      const createTaskDto: CreateTaskDto = req.body;

      const task = await this.taskService.createTask(createTaskDto, userId);

      res.status(201).json({
        success: true,
        message: 'Tarea creada exitosamente',
        data: task,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al crear tarea',
        });
      }
    }
  };

  updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId!;
      const taskId = parseInt(req.params.id);
      const updateTaskDto: UpdateTaskDto = req.body;

      if (isNaN(taskId)) {
        res.status(400).json({
          success: false,
          message: 'ID de tarea inválido',
        });
        return;
      }

      const task = await this.taskService.updateTask(taskId, updateTaskDto, userId);

      res.status(200).json({
        success: true,
        message: 'Tarea actualizada exitosamente',
        data: task,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al actualizar tarea',
        });
      }
    }
  };

  deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId!;
      const taskId = parseInt(req.params.id);

      if (isNaN(taskId)) {
        res.status(400).json({
          success: false,
          message: 'ID de tarea inválido',
        });
        return;
      }

      await this.taskService.deleteTask(taskId, userId);

      res.status(200).json({
        success: true,
        message: 'Tarea eliminada exitosamente',
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al eliminar tarea',
        });
      }
    }
  };
}

