import { Response } from 'express';
import { CreditService } from './credit.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middleware/auth.middleware';

const creditService = new CreditService();

export const getDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const dashboard = await creditService.getDashboard(userId);
  res.status(200).json(dashboard);
});
