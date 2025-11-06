import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { registerValidator, loginValidator } from '../validators/authValidator';
import { validate } from '../middlewares/validationMiddleware';

const router = Router();
const authController = new AuthController();

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);

export default router;

