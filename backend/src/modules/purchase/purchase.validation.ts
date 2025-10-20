import { z } from 'zod';

export const initiatePurchaseSchema = z.object({
  courseId: z.string().min(1),
  courseName: z.string().min(1),
  amount: z.number().positive()
});

export const payPurchaseSchema = z.object({
  cardNumber: z.string().min(13),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/),
  cvv: z.string().min(3),
  cardHolder: z.string().min(1)
});
