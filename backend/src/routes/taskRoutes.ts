import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import {
  createTaskValidator,
  updateTaskValidator,
  filterTasksValidator,
} from '../validators/taskValidator';
import { validate } from '../middlewares/validationMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const taskController = new TaskController();

// Todas las rutas de tareas requieren autenticación
router.use(authMiddleware);

router.get('/', filterTasksValidator, validate, taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', createTaskValidator, validate, taskController.createTask);
router.put('/:id', updateTaskValidator, validate, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;

