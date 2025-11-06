import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/config';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

export const createApp = (): Application => {
  const app = express();

  // middlewares de seguridad
  app.use(helmet());
  
  // CORS configurado para aceptar múltiples orígenes
  app.use(cors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (como apps móviles, Postman, etc)
      if (!origin) return callback(null, true);
      
      // En desarrollo, permitir todos los orígenes
      if (config.server.nodeEnv === 'development') {
        return callback(null, true);
      }
      
      // En producción, validar contra la lista de orígenes permitidos
      if (Array.isArray(config.cors.origin)) {
        if (config.cors.origin.includes(origin)) {
          return callback(null, true);
        }
      }
      
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }));

  // middlewares para parsear
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logger
  if (config.server.nodeEnv === 'development') {
    app.use(morgan('dev'));
  }

  // Configurar prefijo y rutas
  app.use(config.server.apiPrefix, routes);

  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Bienvenido a la API de Gestor de Tareas',
      version: '1.0.0',
    });
  });

  app.get('/api/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'API is healthy',
      timestamp: new Date().toISOString(),
      environment: config.server.nodeEnv,
    });
  });

  // Manejadarr de errores
  app.use(errorHandler);

  return app;
};

