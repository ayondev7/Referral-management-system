import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  referralCode: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Please enter your password')
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1)
});
