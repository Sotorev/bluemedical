import 'reflect-metadata';
import { createApp } from './app';
import { AppDataSource } from './config/database';
import { config } from './config/config';

const startServer = async () => {
  try {
    // Inicializar conexión a la base de datos
    await AppDataSource.initialize();
    console.log('Conexión a la base de datos establecida');
    
    // Crear y configurar la aplicación
    const app = createApp();

    // Iniciar el servidor
    const server = app.listen(config.server.port, () => {
      console.log(`Servidor corriendo en puerto ${config.server.port}`);
      console.log(`Ambiente: ${config.server.nodeEnv}`);
      console.log(`API: http://localhost:${config.server.port}${config.server.apiPrefix}`);
    });

    // Manejo de cierre 
    const shutdown = async () => {
      console.log('Cerrando servidor...');
      server.close(async () => {
        if (AppDataSource.isInitialized) {
          await AppDataSource.destroy();
        }
        console.log('Servidor cerrado correctamente');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

