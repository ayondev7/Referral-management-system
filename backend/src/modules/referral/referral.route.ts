import { Router } from 'express';
import { getReferrals, getReferralsPaginated, getReferralStats, getReferralAnalytics } from './referral.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getReferrals);
router.get('/paginated', authMiddleware, getReferralsPaginated);
router.get('/stats', authMiddleware, getReferralStats);
router.get('/analytics', authMiddleware, getReferralAnalytics);

export default router;
