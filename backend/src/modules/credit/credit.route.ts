import { Router } from 'express';
import { getDashboard } from './credit.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getDashboard);

export default router;
