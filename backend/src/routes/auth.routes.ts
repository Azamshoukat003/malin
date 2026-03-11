import { Router } from 'express';
import {
  login,
  logout,
  me,
  refreshSession,
  register,
  requestMagicLink,
  requestPasswordResetOtp,
  resetPasswordWithOtp,
  verifyMagicLink,
  verifyPasswordResetOtp
} from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  authLoginRateLimit,
  authRegisterRateLimit,
  forgotPasswordRateLimit,
  magicLinkRateLimit
} from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/register', authRegisterRateLimit, register);
router.post('/login', authLoginRateLimit, login);
router.post('/request-magic-link', magicLinkRateLimit, requestMagicLink);
router.post('/forgot-password/request-otp', forgotPasswordRateLimit, requestPasswordResetOtp);
router.post('/forgot-password/verify-otp', forgotPasswordRateLimit, verifyPasswordResetOtp);
router.post('/forgot-password/reset', forgotPasswordRateLimit, resetPasswordWithOtp);
router.post('/refresh', authLoginRateLimit, refreshSession);
router.get('/verify', verifyMagicLink);
router.post('/logout', logout);
router.get('/me', authMiddleware, me);

export default router;
