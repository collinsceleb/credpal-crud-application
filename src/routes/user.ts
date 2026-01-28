import { Router, IRouter, RequestHandler } from 'express';
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

const router: IRouter = Router();

router.use(authMiddleware as unknown as RequestHandler);

router.get('/', getAllUsers as unknown as RequestHandler);
router.get('/:id', getUserById as unknown as RequestHandler);
router.put('/:id', updateUser as unknown as RequestHandler);
router.delete('/:id', deleteUser as unknown as RequestHandler);

export default router;
