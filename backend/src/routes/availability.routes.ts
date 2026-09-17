import { Router } from 'express';
import { checkAvailability } from '../controllers/availability.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/check', checkAvailability);

export default router;
