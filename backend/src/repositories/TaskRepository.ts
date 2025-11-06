import { Repository } from 'typeorm';
import { Task, TaskStatus } from '../entities/Task';
import { AppDataSource } from '../config/database';

export class TaskRepository {
  private repository: Repository<Task>;

  constructor() {
    this.repository = AppDataSource.getRepository(Task);
  }

  async findAll(): Promise<Task[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Task | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByUserId(userId: number): Promise<Task[]> {
    return this.repository.find({ where: { userId } });
  }

  async findByUserIdAndStatus(userId: number, status: TaskStatus): Promise<Task[]> {
    return this.repository.find({ where: { userId, status } });
  }

  async create(taskData: Partial<Task>): Promise<Task> {
    const task = this.repository.create(taskData);
    return this.repository.save(task);
  }

  async update(id: number, taskData: Partial<Task>): Promise<Task | null> {
    await this.repository.update(id, taskData);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async existsByIdAndUserId(id: number, userId: number): Promise<boolean> {
    const count = await this.repository.count({ where: { id, userId } });
    return count > 0;
  }
}

