import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError, asyncHandler } from '../utils/errors';

const prisma = new PrismaClient();

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const { status, search, sortBy, order } = req.query;

  const where: any = {};
  if (status) where.status = String(status);
  
  if (search) {
    where.OR = [
      { customer: { fullName: { contains: String(search), mode: 'insensitive' } } },
      { vehicle: { plateNumber: { contains: String(search), mode: 'insensitive' } } }
    ];
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sortBy && ['startDate', 'endDate', 'totalCost', 'createdAt'].includes(String(sortBy))) {
    orderBy = { [String(sortBy)]: order === 'asc' ? 'asc' : 'desc' };
  }

  const bookings = await prisma.booking.findMany({
    where,
    orderBy,
    include: {
      vehicle: true,
      customer: true
    }
  });

  res.json(bookings);
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const booking = await prisma.booking.findUnique({
    where: { id: Number(id) },
    include: {
      vehicle: { include: { category: true } },
      customer: true
    }
  });

  if (!booking) throw new AppError('Booking not found', 404);
  res.json(booking);
});

export const getTimeline = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await prisma.booking.findMany({
    where: { status: { not: 'Cancelled' } },
    include: {
      vehicle: true,
      customer: true
    },
    orderBy: { startDate: 'asc' }
  });

  const timeline = bookings.map(b => ({
    id: b.id,
    vehicleId: b.vehicleId,
    vehicleName: `${b.vehicle.make} ${b.vehicle.model} · ${b.vehicle.plateNumber}`,
    startDate: b.startDate,
    endDate: b.endDate,
    status: b.status,
    customerName: b.customer.fullName
  }));

  res.json(timeline);
});
