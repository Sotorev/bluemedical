import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

export interface AuthRequest extends Request {
  userId?: number;
  userEmail?: string;
}

const authService = new AuthService();

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Token no proporcionado',
      });
      return;
    }

    const token = authHeader.substring(7);

    try {
      const decoded = authService.verifyToken(token);
      req.userId = decoded.userId;
      req.userEmail = decoded.email;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Token inválido o expirado',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en la autenticación',
    });
  }
};

