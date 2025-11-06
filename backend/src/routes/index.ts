import { Router } from 'express';
import authRoutes from './authRoutes';
import taskRoutes from './taskRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

//Estado de la api
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

export default router;

