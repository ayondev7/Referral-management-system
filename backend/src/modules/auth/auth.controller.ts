import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middleware/auth.middleware';
import { registerSchema, loginSchema, refreshSchema } from './auth.validation';

const authService = new AuthService();

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

  const result = await authService.register(validation.data);
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

  const result = await authService.login(validation.data.email, validation.data.password);
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

  const result = await authService.refreshAccessToken(validation.data.refreshToken);
  return res.status(200).json(result);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Logged out successfully' });
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });
  }

  const profile = await authService.getUserProfile(req.user.id);
  return res.status(200).json(profile);
});
