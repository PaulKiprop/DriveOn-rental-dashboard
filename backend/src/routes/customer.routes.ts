import { Router } from 'express';
import { getAll, getOne } from '../controllers/customer.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', getAll);
router.get('/:id', getOne);

export default router;
