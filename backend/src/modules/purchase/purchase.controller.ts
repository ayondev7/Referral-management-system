import { Response } from 'express';
import { PurchaseService } from './purchase.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middleware/auth.middleware';
import { z } from 'zod';

const purchaseService = new PurchaseService();

const initiatePurchaseSchema = z.object({
  courseId: z.string().min(1),
  courseName: z.string().min(1),
  amount: z.number().positive()
});

const payPurchaseSchema = z.object({
  cardNumber: z.string().min(13),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/),
  cvv: z.string().min(3),
  cardHolder: z.string().min(1)
});

export const initiatePurchase = asyncHandler(async (req: AuthRequest, res: Response) => {
  const validation = initiatePurchaseSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({
      message: 'Validation error',
      errors: validation.error.issues,
      statusCode: 400
    });
    return;
  }

  const userId = req.user!.id;
  const { courseId, courseName, amount } = validation.data;

  const purchase = await purchaseService.initiatePurchase(userId, courseId, courseName, amount);

  res.status(201).json({
    purchaseId: purchase._id,
    courseName: purchase.courseName,
    amount: purchase.amount,
    status: purchase.status
  });
});

export const payPurchase = asyncHandler(async (req: AuthRequest, res: Response) => {
  const validation = payPurchaseSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({
      message: 'Validation error',
      errors: validation.error.issues,
      statusCode: 400
    });
    return;
  }

  const userId = req.user!.id;
  const { purchaseId } = req.params;

  const purchase = await purchaseService.processPurchase(purchaseId, userId, validation.data);

  res.status(200).json({
    success: true,
    message: 'Payment successful',
    purchase: {
      id: purchase._id,
      courseName: purchase.courseName,
      amount: purchase.amount,
      status: purchase.status,
      isFirstPurchase: purchase.isFirstPurchase
    }
  });
});

export const getPurchases = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const purchases = await purchaseService.getUserPurchases(userId);
  res.status(200).json(purchases);
});
