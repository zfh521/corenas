import { Router } from 'express';
import { getUser, updateUser, deleteUser, listUsers } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// 所有用户路由都需要认证
// router.use(authenticateToken);

router.get('/', listUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router; 