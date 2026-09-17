import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { signToken } from '../utils/jwt';
import { AppError, asyncHandler } from '../utils/errors';

const prisma = new PrismaClient();

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new AppError('Please provide username and password', 400);
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = signToken({ id: user.id, username: user.username, role: user.role });
  
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  const { passwordHash, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, token });
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password, fullName } = req.body;
  
  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] }
  });
  if (existing) {
    throw new AppError('Username or email already exists', 400);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.create({
    data: { username, email, passwordHash, fullName }
  });

  const token = signToken({ id: user.id, username: user.username, role: user.role });
  
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  const { passwordHash: _, ...userWithoutPassword } = user;
  res.status(201).json({ user: userWithoutPassword, token });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Not authenticated', 401);
  
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, username: true, email: true, fullName: true, role: true, createdAt: true }
  });
  
  if (!user) throw new AppError('User not found', 404);
  res.json({ user });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.json({ success: true, data: {} });
});
