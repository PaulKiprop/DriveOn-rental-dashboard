import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError, asyncHandler } from '../utils/errors';

const prisma = new PrismaClient();

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { vehicleId, customerId, startDate, endDate, notes } = req.body;
  const parsedVehicleId = Number(vehicleId);
  const parsedCustomerId = Number(customerId);
  const start = new Date(String(startDate));
  const end = new Date(String(endDate));

  if (!Number.isInteger(parsedVehicleId) || !Number.isInteger(parsedCustomerId)) {
    throw new AppError('A valid vehicle and customer are required', 400);
  }

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new AppError('Invalid date format', 400);
  }

  if (start >= end) {
    throw new AppError('Return date must be after the pickup date', 400);
  }

  const [vehicle, customer] = await Promise.all([
    prisma.vehicle.findUnique({ where: { id: parsedVehicleId } }),
    prisma.customer.findUnique({ where: { id: parsedCustomerId } })
  ]);

  if (!vehicle) throw new AppError('Vehicle not found', 404);
  if (!customer) throw new AppError('Customer not found', 404);
  if (vehicle.status === 'Maintenance') {
    throw new AppError('This vehicle is in maintenance and cannot be booked', 409);
  }

  const conflict = await prisma.booking.findFirst({
    where: {
      vehicleId: parsedVehicleId,
      status: { not: 'Cancelled' },
      NOT: {
        OR: [
          { endDate: { lte: start } },
          { startDate: { gte: end } }
        ]
      }
    },
    include: { customer: true }
  });

  if (conflict) {
    throw new AppError(
      `Vehicle is unavailable: it is booked by ${conflict.customer.fullName} from ${conflict.startDate.toISOString().slice(0, 10)} to ${conflict.endDate.toISOString().slice(0, 10)}`,
      409
    );
  }

  const booking = await prisma.booking.create({
    data: {
      vehicleId: parsedVehicleId,
      customerId: parsedCustomerId,
      startDate: start,
      endDate: end,
      notes: typeof notes === 'string' && notes.trim() ? notes.trim() : null,
      status: 'Pending'
    },
    include: { vehicle: true, customer: true }
  });

  res.status(201).json(booking);
});

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
