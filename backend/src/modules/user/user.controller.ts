import { Request, Response } from 'express';
import { UserService } from './user.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { verifyRefreshToken, generateAccessToken } from '../../utils/jwt';
import { z } from 'zod';

const userService = new UserService();

const registerSchema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  referralCode: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Please enter your password')
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1)
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return res.status(400).json({
      message: firstError.message,
      errors: validation.error.issues,
      statusCode: 400
    });
  }

  const result = await userService.register(validation.data);
  console.log(`User registered: ${result.user.email}`);
  return res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return res.status(400).json({
      message: firstError.message,
      errors: validation.error.issues,
      statusCode: 400
    });
  }

  const result = await userService.login(validation.data.email, validation.data.password);
  console.log(`User logged in: ${result.user.email}`);
  return res.status(200).json(result);
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const validation = refreshSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      message: 'Validation error',
      errors: validation.error.issues,
      statusCode: 400
    });
  }

  try {
    const decoded = verifyRefreshToken(validation.data.refreshToken);
    const accessToken = generateAccessToken({ id: decoded.id, email: decoded.email });
    console.log(`Token refreshed for user: ${decoded.email}`);
    return res.status(200).json({ accessToken });
  } catch (error) {
    const err: any = new Error('Your session has expired. Please log in again');
    err.statusCode = 401;
    throw err;
  }
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Logged out successfully' });
});
