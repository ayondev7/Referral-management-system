import { Response } from 'express';
import { ReferralService } from './referral.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middleware/auth.middleware';

const referralService = new ReferralService();

export const getReferrals = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const referrals = await referralService.getUserReferrals(userId);
  console.log(`Fetched ${referrals.length} referrals for user ${userId}`);
  res.status(200).json(referrals);
});

export const getReferralStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const stats = await referralService.getReferralStats(userId);
  console.log(`Fetched referral stats for user ${userId}:`, stats);
  res.status(200).json(stats);
});
