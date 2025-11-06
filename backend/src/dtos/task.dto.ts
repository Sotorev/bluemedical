import { TaskStatus } from '../entities/Task';

export interface CreateTaskDto {
  title: string;
  description: string;
  status?: TaskStatus;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface TaskResponseDto {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

