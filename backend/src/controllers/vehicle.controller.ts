import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError, asyncHandler } from '../utils/errors';

const prisma = new PrismaClient();

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const { status, categoryId, fuelType, transmission, sortBy, order } = req.query;

  const where: any = {};
  if (status) where.status = String(status);
  if (categoryId) where.categoryId = Number(categoryId);
  if (fuelType) where.fuelType = String(fuelType);
  if (transmission) where.transmission = String(transmission);

  let orderBy: any = { createdAt: 'desc' };
  if (sortBy && ['dailyRate', 'mileage', 'year'].includes(String(sortBy))) {
    orderBy = { [String(sortBy)]: order === 'asc' ? 'asc' : 'desc' };
  }

  const vehicles = await prisma.vehicle.findMany({
    where,
    orderBy,
    include: { category: true }
  });

  res.json(vehicles);
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
      bookings: {
        include: { customer: true },
        orderBy: { startDate: 'desc' }
      }
    }
  });

  if (!vehicle) throw new AppError('Vehicle not found', 404);

  const completedBookings = vehicle.bookings.filter(b => b.status === 'Completed');
  const totalEarnings = completedBookings.reduce((sum, b) => sum + Number(b.totalCost || 0), 0);
  
  const totalDaysSinceCreated = Math.max(1, Math.floor((Date.now() - vehicle.createdAt.getTime()) / (1000 * 60 * 60 * 24)));
  
  const rentedDays = completedBookings.reduce((sum, b) => {
    const days = Math.ceil((b.endDate.getTime() - b.startDate.getTime()) / (1000 * 60 * 60 * 24));
    return sum + days;
  }, 0);

  const utilizationRate = (rentedDays / totalDaysSinceCreated) * 100;

  res.json({
    ...vehicle,
    stats: {
      totalEarnings,
      utilizationRate: Math.min(100, utilizationRate),
      totalBookings: vehicle.bookings.length,
      completedBookings: completedBookings.length
    }
  });
});
