import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../utils/errors';
import { protect } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(protect);

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const categories = await prisma.vehicleCategory.findMany({
    orderBy: { name: 'asc' },
  });
  res.json(categories);
}));

export default router;
