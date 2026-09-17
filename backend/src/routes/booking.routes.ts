import { Router } from 'express';
import { create, getAll, getOne, getTimeline } from '../controllers/booking.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/timeline', getTimeline);
router.get('/', getAll);
router.post('/', create);
router.get('/:id', getOne);

export default router;
