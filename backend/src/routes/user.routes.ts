import { Router } from 'express';
import { getUserRecordings, updateProfile } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/recordings', getUserRecordings);
router.patch('/profile', updateProfile);

export default router;
