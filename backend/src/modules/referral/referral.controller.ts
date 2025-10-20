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

export const getReferralStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const stats = await referralService.getReferralStats(userId);
  res.status(200).json(stats);
});
