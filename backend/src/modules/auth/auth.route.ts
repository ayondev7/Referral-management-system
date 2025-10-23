import { Router } from 'express';
import { register, login, refresh, logout, getProfile, guestLogin } from './auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/guest-login', guestLogin);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authMiddleware, getProfile);

export default router;
