import { Router, IRouter, RequestHandler } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router: IRouter = Router();

router.post('/register', register as unknown as RequestHandler);
router.post('/login', login as unknown as RequestHandler);

router.get('/me', authMiddleware as unknown as RequestHandler, getMe as unknown as RequestHandler);

export default router;
