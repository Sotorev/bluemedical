import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const registerDto: RegisterDto = req.body;
      const result = await this.authService.register(registerDto);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: result,
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
          message: 'Error al registrar usuario',
        });
      }
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginDto: LoginDto = req.body;
      const result = await this.authService.login(loginDto);

      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al iniciar sesión',
        });
      }
    }
  };
}

