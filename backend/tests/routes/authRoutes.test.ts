import 'reflect-metadata';
import request from 'supertest';
import { Application } from 'express';
import { createApp } from '../../src/app';
import { AppDataSource } from '../../src/config/database';
import { User } from '../../src/entities/User';

describe('Auth Routes', () => {
  let app: Application;

  beforeAll(async () => {
    // Inicializar la conexión a la base de datos
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    app = createApp();

    // Limpiar datos de prueba existentes antes de comenzar
    const userRepository = AppDataSource.getRepository(User);
    const testEmails = [
      'test@example.com',
      'duplicate@example.com',
      'test2@example.com',
      'login@example.com',
    ];
    
    for (const email of testEmails) {
      await userRepository.delete({ email });
    }
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    const userRepository = AppDataSource.getRepository(User);
    const testEmails = [
      'test@example.com',
      'duplicate@example.com',
      'test2@example.com',
      'login@example.com',
    ];
    
    for (const email of testEmails) {
      await userRepository.delete({ email });
    }

    // Cerrar la conexión después de todos los tests
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  describe('POST /api/auth/register', () => {
    it('debería registrar un nuevo usuario exitosamente', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.user.name).toBe('Test User');
    });

    it('debería retornar error 400 si el email ya existe', async () => {
      // Primero crear un usuario
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'password123',
          name: 'First User',
        });

      // Intentar crear otro con el mismo email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'password123',
          name: 'Second User',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email');
    });

    it('debería retornar error 400 si falta el email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          password: 'password123',
          name: 'Test User',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('debería retornar error 400 si la contraseña es muy corta', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test2@example.com',
          password: '123', 
          name: 'Test User',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    // Primero crear un usuario para poder hacer login
    beforeAll(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'login@example.com',
          password: 'password123',
          name: 'Login User',
        });
    });

    it('debería hacer login exitosamente con credenciales válidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe('login@example.com');
    });

    it('debería retornar error 401 con email incorrecto', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Credenciales inválidas');
    });

    it('debería retornar error 401 con contraseña incorrecta', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Credenciales inválidas');
    });

    it('debería retornar error 400 si falta el email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});

