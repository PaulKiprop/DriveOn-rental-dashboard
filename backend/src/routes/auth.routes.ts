import { Router } from 'express';
import { login, register, me, logout } from '../controllers/auth.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', protect, me);
router.post('/logout', logout);

export default router;
