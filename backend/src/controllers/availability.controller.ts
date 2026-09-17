import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError, asyncHandler } from '../utils/errors';

const prisma = new PrismaClient();

export const checkAvailability = asyncHandler(async (req: Request, res: Response) => {
  const { vehicleId, startDate, endDate } = req.query;

  if (!vehicleId || !startDate || !endDate) {
    throw new AppError('vehicleId, startDate, and endDate are required', 400);
  }

  const start = new Date(String(startDate));
  const end = new Date(String(endDate));

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new AppError('Invalid date format', 400);
  }

  if (start >= end) {
    throw new AppError('Start date must be before end date', 400);
  }

  // Find overlapping bookings that are not cancelled
  const overlappingBooking = await prisma.booking.findFirst({
    where: {
      vehicleId: Number(vehicleId),
      status: { not: 'Cancelled' },
      NOT: {
        OR: [
          { endDate: { lte: start } }, // existing ends before new starts
          { startDate: { gte: end } }  // existing starts after new ends
        ]
      }
    },
    include: { customer: true }
  });

  if (overlappingBooking) {
    return res.json({
      available: false,
      conflict: {
        bookingId: overlappingBooking.id,
        customerName: overlappingBooking.customer.fullName,
        startDate: overlappingBooking.startDate,
        endDate: overlappingBooking.endDate,
        status: overlappingBooking.status
      }
    });
  }

  res.json({ available: true });
});
