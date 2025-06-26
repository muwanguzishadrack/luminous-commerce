import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/auth.service';
import { sendSuccess, sendError } from '@/utils/response';
import { 
  AuthenticatedRequest, 
  RegisterRequest, 
  LoginRequest, 
  JoinOrganizationRequest 
} from '@/types';

const authService = new AuthService();

export class AuthController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: RegisterRequest = req.body;
      const result = await authService.register(data);
      
      sendSuccess(res, 'Organization and user created successfully', result, 201);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User already exists with this email' || 
            error.message === 'Organization slug already exists') {
          return sendError(res, error.message, undefined, 409);
        }
      }
      next(error);
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: LoginRequest = req.body;
      const result = await authService.login(data);
      
      sendSuccess(res, 'Login successful', result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Invalid credentials' || 
            error.message === 'Account is deactivated' ||
            error.message === 'Organization is deactivated' ||
            error.message === 'Organization not found') {
          return sendError(res, error.message, undefined, 401);
        }
      }
      next(error);
    }
  }

  joinOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: JoinOrganizationRequest = req.body;
      const result = await authService.joinOrganization(data);
      
      sendSuccess(res, 'Successfully joined organization', result, 201);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Organization not found') {
          return sendError(res, error.message, undefined, 404);
        }
        if (error.message === 'User already exists in this organization' ||
            error.message === 'Organization is not accepting new members') {
          return sendError(res, error.message, undefined, 409);
        }
      }
      next(error);
    }
  }

  getCurrentUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', undefined, 401);
      }

      const user = await authService.getCurrentUser(req.user.userId);
      
      if (!user) {
        return sendError(res, 'User not found', undefined, 404);
      }

      sendSuccess(res, 'User retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  }

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return sendError(res, 'Refresh token required', undefined, 400);
      }

      const result = await authService.refreshToken(refreshToken);
      
      sendSuccess(res, 'Token refreshed successfully', result);
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid refresh token') {
        return sendError(res, error.message, undefined, 401);
      }
      next(error);
    }
  }

  logout = async (req: Request, res: Response) => {
    sendSuccess(res, 'Logout successful');
  }

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      await authService.forgotPassword(email);
      
      sendSuccess(res, 'If an account exists with this email, a password reset link has been sent');
    } catch (error) {
      next(error);
    }
  }

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = req.body;
      await authService.resetPassword(token, newPassword);
      
      sendSuccess(res, 'Password reset successfully');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Invalid or expired reset token') {
          return sendError(res, error.message, undefined, 400);
        }
      }
      next(error);
    }
  }
}