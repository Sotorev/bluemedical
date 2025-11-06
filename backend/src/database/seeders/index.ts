import 'reflect-metadata';
import { AppDataSource } from '../../config/database';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/User';
import { Task, TaskStatus } from '../../entities/Task';

const seed = async () => {
  try {
    // Inicializar conexión
    await AppDataSource.initialize();
    console.log('Conexión a la base de datos establecida');

    const userRepository = AppDataSource.getRepository(User);
    const taskRepository = AppDataSource.getRepository(Task);

    await AppDataSource.createQueryBuilder()
      .delete()
      .from(Task)
      .execute();
    
    await AppDataSource.createQueryBuilder()
      .delete()
      .from(User)
      .execute();

    // Crear usuarios de prueba
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user1 = await userRepository.save({
      email: 'jose@example.com',
      password: hashedPassword,
      name: 'Jose Soto',
    });

    const user2 = await userRepository.save({
      email: 'manuel@example.com',
      password: hashedPassword,
      name: 'Manuel Revolorio',
    });

    console.log('Usuarios creados');

    // Crear tareas de prueba para user1
    const tasksUser1 = [
      {
        title: 'Completar documentación del proyecto',
        description: 'Escribir la documentación técnica completa del API',
        status: TaskStatus.IN_PROGRESS,
        userId: user1.id,
      },
      {
        title: 'Revisar pull requests',
        description: 'Revisar y aprobar los PRs pendientes del equipo',
        status: TaskStatus.PENDING,
        userId: user1.id,
      },
      {
        title: 'Implementar tests unitarios',
        description: 'Crear tests para los nuevos endpoints del API',
        status: TaskStatus.COMPLETED,
        userId: user1.id,
      },
      {
        title: 'Reunión con el cliente',
        description: 'Presentar el avance del proyecto al cliente',
        status: TaskStatus.PENDING,
        userId: user1.id,
      },
    ];

    // Crear tareas de prueba para user2
    const tasksUser2 = [
      {
        title: 'Diseñar interfaz de usuario',
        description: 'Crear mockups para la nueva funcionalidad',
        status: TaskStatus.IN_PROGRESS,
        userId: user2.id,
      },
      {
        title: 'Optimizar base de datos',
        description: 'Mejorar los índices y queries lentos',
        status: TaskStatus.PENDING,
        userId: user2.id,
      },
      {
        title: 'Configurar CI/CD',
        description: 'Implementar pipeline de despliegue automático',
        status: TaskStatus.COMPLETED,
        userId: user2.id,
      },
    ];

    await taskRepository.save([...tasksUser1, ...tasksUser2]);

    console.log('Tareas creadas');
    console.log('Datos de prueba:');
    console.log('Usuario 1:');
    console.log('   Email: jose@example.com');
    console.log('   Password: password123');
    console.log('Usuario 2:');
    console.log('   Email: manuel@example.com');
    console.log('   Password: password123');

    await AppDataSource.destroy();
    console.log('\nSeeder ejecutado correctamente');
  } catch (error) {
    console.error('Error al ejecutar seeder:', error);
    process.exit(1);
  }
};

seed();