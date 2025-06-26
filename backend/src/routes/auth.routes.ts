import { Router } from 'express';
import { AuthController } from '@/controllers/auth.controller';
import { authenticate } from '@/middleware/auth';
import { handleValidationErrors } from '@/middleware/validation';
import { 
  registerValidation, 
  joinOrganizationValidation,
  loginValidation, 
  refreshTokenValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} from '@/validation/auth.validation';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', registerValidation, handleValidationErrors, authController.register);
router.post('/join-organization', joinOrganizationValidation, handleValidationErrors, authController.joinOrganization);
router.post('/login', loginValidation, handleValidationErrors, authController.login);
router.post('/refresh-token', refreshTokenValidation, handleValidationErrors, authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/forgot-password', forgotPasswordValidation, handleValidationErrors, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, handleValidationErrors, authController.resetPassword);

// Protected routes
router.get('/me', authenticate, authController.getCurrentUser);

export default router;