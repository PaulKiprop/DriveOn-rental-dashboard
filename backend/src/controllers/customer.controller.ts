import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError, asyncHandler } from '../utils/errors';

const prisma = new PrismaClient();

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const { search, sortBy, order } = req.query;

  const where: any = {};
  if (search) {
    where.OR = [
      { fullName: { contains: String(search), mode: 'insensitive' } },
      { email: { contains: String(search), mode: 'insensitive' } },
      { licenseNumber: { contains: String(search), mode: 'insensitive' } }
    ];
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sortBy && ['fullName', 'createdAt'].includes(String(sortBy))) {
    orderBy = { [String(sortBy)]: order === 'asc' ? 'asc' : 'desc' };
  }

  const customers = await prisma.customer.findMany({
    where,
    orderBy,
    include: {
      _count: {
        select: { bookings: true }
      }
    }
  });

  res.json(customers);
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const customer = await prisma.customer.findUnique({
    where: { id: Number(id) },
    include: {
      bookings: {
        include: { vehicle: { include: { category: true } } },
        orderBy: { startDate: 'desc' }
      }
    }
  });

  if (!customer) throw new AppError('Customer not found', 404);

  const completedBookings = customer.bookings.filter(b => b.status === 'Completed');
  const totalSpent = completedBookings.reduce((sum, b) => sum + Number(b.totalCost || 0), 0);
  
  // Find favourite category
  const catCounts: Record<string, number> = {};
  customer.bookings.forEach(b => {
    const cat = b.vehicle.category.name;
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  });
  
  let favouriteCategory = null;
  let maxCount = 0;
  Object.entries(catCounts).forEach(([cat, count]) => {
    if (count > maxCount) {
      maxCount = count;
      favouriteCategory = cat;
    }
  });

  res.json({
    ...customer,
    stats: {
      totalSpent,
      totalBookings: customer.bookings.length,
      completedBookings: completedBookings.length,
      favouriteCategory
    }
  });
});
