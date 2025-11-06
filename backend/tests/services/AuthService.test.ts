import { AuthService } from '../../src/services/AuthService';
import { UserRepository } from '../../src/repositories/UserRepository';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../../src/repositories/UserRepository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    authService = new AuthService();
    (authService as any).userRepository = mockUserRepository;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('deberia registrar un nuevo usuario exitosamente', async () => {
      const registerDto = {
        email: 'jose@example.com',
        password: 'password123',
        name: 'Jose Soto',
      };

      const mockUser = {
        id: 1,
        email: registerDto.email,
        name: registerDto.name,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;

      mockUserRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockUserRepository.create.mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      const result = await authService.register(registerDto);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(registerDto.email);
    });

    it('deberia lanzar error si el email ya existe', async () => {
      const registerDto = {
        email: 'jose@example.com',
        password: 'password123',
        name: 'Jose Soto',
      };

      mockUserRepository.findByEmail.mockResolvedValue({ id: 1 } as any);

      await expect(authService.register(registerDto)).rejects.toThrow(
        'El email ya está registrado'
      );
    });
  });

  describe('login', () => {
    it('debería hacer login exitosamente con credenciales válidas', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        email: loginDto.email,
        password: 'hashedPassword',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      const result = await authService.login(loginDto);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
    });

    it('debería lanzar error con email inválido', async () => {
      const loginDto = {
        email: 'invalid@example.com',
        password: 'password123',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow('Credenciales inválidas');
    });

    it('deberia lanzar error con contrasena invalida', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockUser = {
        id: 1,
        email: loginDto.email,
        password: 'hashedPassword',
      } as any;

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow('Credenciales inválidas');
    });
  });

  describe('verifyToken', () => {
    it('deberia verificar un token valido', () => {
      const mockDecoded = { userId: 1, email: 'test@example.com' };
      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      const result = authService.verifyToken('validToken');

      expect(result).toEqual(mockDecoded);
    });

    it('deberia lanzar error con token inválido', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => authService.verifyToken('invalidToken')).toThrow(
        'Token inválido o expirado'
      );
    });
  });
});

