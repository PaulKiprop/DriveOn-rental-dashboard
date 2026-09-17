import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../utils/errors';

const prisma = new PrismaClient();

export const getSummary = asyncHandler(async (req: Request, res: Response) => {
  const [vehicles, bookings, customers] = await Promise.all([
    prisma.vehicle.groupBy({ by: ['status'], _count: true }),
    prisma.booking.groupBy({ by: ['status'], _count: true }),
    prisma.customer.count()
  ]);

  const completedBookings = await prisma.booking.aggregate({
    where: { status: 'Completed' },
    _sum: { totalCost: true }
  });

  const formatCounts = (arr: any[], key: string) => arr.reduce((acc, curr) => {
    acc[curr[key]] = curr._count;
    return acc;
  }, {});

  const vStatus = formatCounts(vehicles, 'status');
  const bStatus = formatCounts(bookings, 'status');

  const totalVehicles = vehicles.reduce((sum, v) => sum + v._count, 0);
  const totalBookings = bookings.reduce((sum, b) => sum + b._count, 0);

  res.json({
    totalVehicles,
    available: vStatus['Available'] || 0,
    rented: vStatus['Rented'] || 0,
    maintenance: vStatus['Maintenance'] || 0,
    totalBookings,
    pending: bStatus['Pending'] || 0,
    confirmed: bStatus['Confirmed'] || 0,
    active: bStatus['Active'] || 0,
    completed: bStatus['Completed'] || 0,
    cancelled: bStatus['Cancelled'] || 0,
    totalCustomers: customers,
    totalRevenue: completedBookings._sum.totalCost || 0
  });
});

export const getEarnings = asyncHandler(async (req: Request, res: Response) => {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const bookings = await prisma.booking.findMany({
    where: {
      status: 'Completed',
      endDate: { gte: oneYearAgo }
    },
    select: {
      endDate: true,
      totalCost: true
    }
  });

  const monthlyData: Record<string, { revenue: number; sortKey: number }> = {};

  bookings.forEach(b => {
    const date = new Date(b.endDate);
    // Use YYYY-MM as sortable key, display as 'Jan 2026'
    const sortKey = date.getFullYear() * 100 + (date.getMonth() + 1);
    const month = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    if (!monthlyData[month]) monthlyData[month] = { revenue: 0, sortKey };
    monthlyData[month].revenue += Number(b.totalCost);
  });

  const result = Object.entries(monthlyData)
    .map(([month, data]) => ({ month, revenue: data.revenue, sortKey: data.sortKey }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ month, revenue }) => ({ month, revenue }));

  res.json(result);
});

export const getEarningsByCategory = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await prisma.booking.findMany({
    where: { status: 'Completed' },
    include: {
      vehicle: {
        include: { category: true }
      }
    }
  });

  const catData: Record<string, { revenue: number; count: number }> = {};
  
  bookings.forEach(b => {
    const catName = b.vehicle.category.name;
    if (!catData[catName]) catData[catName] = { revenue: 0, count: 0 };
    catData[catName].revenue += Number(b.totalCost);
    catData[catName].count += 1;
  });

  const result = Object.entries(catData).map(([category, data]) => ({
    category,
    revenue: data.revenue,
    bookingCount: data.count
  }));

  res.json(result);
});

export const getUtilization = asyncHandler(async (req: Request, res: Response) => {
  const categories = await prisma.vehicleCategory.findMany({
    include: {
      vehicles: {
        select: { id: true, status: true }
      }
    }
  });

  let totalVehicles = 0;
  let totalRented = 0;

  const breakdown = categories.map(cat => {
    const catTotal = cat.vehicles.length;
    const catRented = cat.vehicles.filter(v => v.status === 'Rented' || v.status === 'Active').length; // Active booking = Rented car
    
    totalVehicles += catTotal;
    totalRented += catRented;

    return {
      category: cat.name,
      total: catTotal,
      rented: catRented,
      utilizationPercentage: catTotal > 0 ? (catRented / catTotal) * 100 : 0
    };
  });

  res.json({
    totalVehicles,
    currentlyRented: totalRented,
    utilizationPercentage: totalVehicles > 0 ? (totalRented / totalVehicles) * 100 : 0,
    breakdown
  });
});

export const getRecent = asyncHandler(async (req: Request, res: Response) => {
  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      vehicle: { select: { make: true, model: true, plateNumber: true } },
      customer: { select: { fullName: true } }
    }
  });

  const recentVehicles = await prisma.vehicle.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  });

  res.json({ recentBookings, recentVehicles });
});
