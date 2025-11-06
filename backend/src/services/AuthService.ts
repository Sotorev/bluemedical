import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { RegisterDto, LoginDto, AuthResponseDto, UserResponseDto } from '../dtos/auth.dto';
import { config } from '../config/config';
import { User } from '../entities/User';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(registerDto.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear usuario
    const user = await this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
    });

    // Generar token
    const token = this.generateToken(user);

    return {
      user: this.mapUserToResponse(user),
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token
    const token = this.generateToken(user);

    return {
      user: this.mapUserToResponse(user),
      token,
    };
  }

  async getUserById(userId: number): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return null;
    }
    return this.mapUserToResponse(user);
  }

  private generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
    };

    return jwt.sign(
      payload, 
      config.jwt.secret as jwt.Secret, 
      {
        expiresIn: config.jwt.expiresIn as string ,
      } as jwt.SignOptions
    );
  }

  private mapUserToResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  verifyToken(token: string): { userId: number; email: string } {
    try {
      const decoded = jwt.verify(token, config.jwt.secret as jwt.Secret) as {
        userId: number;
        email: string;
      };
      return decoded;
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }
}

