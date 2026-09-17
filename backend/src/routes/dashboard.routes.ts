import { Router } from 'express';
import { getSummary, getEarnings, getEarningsByCategory, getUtilization, getRecent } from '../controllers/dashboard.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/summary', getSummary);
router.get('/earnings', getEarnings);
router.get('/earnings-by-category', getEarningsByCategory);
router.get('/utilization', getUtilization);
router.get('/recent', getRecent);

export default router;
