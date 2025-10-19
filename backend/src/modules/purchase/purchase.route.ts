import { Router } from 'express';
import { initiatePurchase, payPurchase, getPurchases, getPurchasedCourses } from './purchase.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.post('/initiate', authMiddleware, initiatePurchase);
router.post('/pay/:purchaseId', authMiddleware, payPurchase);
router.get('/', authMiddleware, getPurchases);
router.get('/purchased-courses', authMiddleware, getPurchasedCourses);

export default router;
