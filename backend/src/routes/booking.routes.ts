import { Router } from 'express';
import { getAll, getOne, getTimeline } from '../controllers/booking.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/timeline', getTimeline);
router.get('/', getAll);
router.get('/:id', getOne);

export default router;
