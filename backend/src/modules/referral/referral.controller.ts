import { Response } from 'express';
import { ReferralService } from './referral.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middleware/auth.middleware';

const referralService = new ReferralService();

export const getReferrals = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const referrals = await referralService.getUserReferrals(userId);
  res.status(200).json(referrals);
});

export const getReferralsPaginated = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 8;
  const result = await referralService.getUserReferralsPaginated(userId, page, limit);
  res.status(200).json(result);
});

export const getReferralStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const stats = await referralService.getReferralStats(userId);
  res.status(200).json(stats);
});
