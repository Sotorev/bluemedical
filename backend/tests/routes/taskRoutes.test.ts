import 'reflect-metadata';
import request from 'supertest';
import { Application } from 'express';
import { createApp } from '../../src/app';
import { AppDataSource } from '../../src/config/database';
import { User } from '../../src/entities/User';
import { Task, TaskStatus } from '../../src/entities/Task';
import * as bcrypt from 'bcrypt';

describe('Task Routes', () => {
  let app: Application;
  let authToken: string;
  let userId: number;

  beforeAll(async () => {
    // Inicializar la conexión a la base de datos
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    app = createApp();

    // Crear un usuario de prueba y obtener su token
    const userRepository = AppDataSource.getRepository(User);
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser = await userRepository.save({
      email: 'tasktest@example.com',
      password: hashedPassword,
      name: 'Task Test User',
    });
    userId = testUser.id;

    // Hacer login para obtener el token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'tasktest@example.com',
        password: 'password123',
      });

    authToken = loginResponse.body.data.token;
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    const taskRepository = AppDataSource.getRepository(Task);
    const userRepository = AppDataSource.getRepository(User);
    await taskRepository.delete({ userId });
    await userRepository.delete({ id: userId });

    // Cerrar la conexión
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  describe('POST /api/tasks', () => {
    it('debería crear una tarea exitosamente', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Nueva tarea de prueba',
          description: 'Esta es una tarea de prueba',
          status: TaskStatus.PENDING,
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Nueva tarea de prueba');
      expect(response.body.data.description).toBe('Esta es una tarea de prueba');
      expect(response.body.data.status).toBe('pendiente');
      expect(response.body.data.userId).toBe(userId);
    });

    it('debería retornar error 401 sin token de autenticación', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Tarea sin token',
          description: 'Esta debería fallar',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Token');
    });

    it('debería retornar error 400 si falta el título', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Sin título',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/tasks', () => {
    let taskId: number;

    beforeAll(async () => {
      // Crear una tarea para los tests
      const taskRepository = AppDataSource.getRepository(Task);
      const task = await taskRepository.save({
        title: 'Tarea para listar',
        description: 'Descripción de prueba',
        status: TaskStatus.PENDING,
        userId,
      });
      taskId = task.id;
    });

    it('debería obtener todas las tareas del usuario', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('debería filtrar tareas por estado', async () => {
      const response = await request(app)
        .get('/api/tasks?status=pendiente')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      response.body.data.forEach((task: any) => {
        expect(task.status).toBe('pendiente');
      });
    });

    it('debería retornar error 401 sin token', async () => {
      await request(app)
        .get('/api/tasks')
        .expect(401);
    });
  });

  describe('GET /api/tasks/:id', () => {
    let taskId: number;

    beforeAll(async () => {
      const taskRepository = AppDataSource.getRepository(Task);
      const task = await taskRepository.save({
        title: 'Tarea para obtener',
        description: 'Descripción',
        status: TaskStatus.IN_PROGRESS,
        userId,
      });
      taskId = task.id;
    });

    it('debería obtener una tarea específica', async () => {
      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(taskId);
      expect(response.body.data.title).toBe('Tarea para obtener');
    });

    it('debería retornar error 404 si la tarea no existe', async () => {
      await request(app)
        .get('/api/tasks/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let taskId: number;

    beforeAll(async () => {
      const taskRepository = AppDataSource.getRepository(Task);
      const task = await taskRepository.save({
        title: 'Tarea para actualizar',
        description: 'Descripción original',
        status: TaskStatus.PENDING,
        userId,
      });
      taskId = task.id;
    });

    it('debería actualizar una tarea exitosamente', async () => {
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Tarea actualizada',
          status: TaskStatus.COMPLETED,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Tarea actualizada');
      expect(response.body.data.status).toBe('completada');
    });

    it('debería retornar error 404 si la tarea no existe', async () => {
      await request(app)
        .put('/api/tasks/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Actualización',
        })
        .expect(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId: number;

    beforeAll(async () => {
      const taskRepository = AppDataSource.getRepository(Task);
      const task = await taskRepository.save({
        title: 'Tarea para eliminar',
        description: 'Esta será eliminada',
        status: TaskStatus.PENDING,
        userId,
      });
      taskId = task.id;
    });

    it('debería eliminar una tarea exitosamente', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('eliminada');

      // Verificar que la tarea ya no existe
      await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('debería retornar error 404 si la tarea no existe', async () => {
      await request(app)
        .delete('/api/tasks/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});

