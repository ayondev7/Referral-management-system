import { Router } from 'express';
import { getReferrals, getReferralStats } from './referral.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getReferrals);
router.get('/stats', authMiddleware, getReferralStats);

export default router;
