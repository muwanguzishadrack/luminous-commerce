import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/utils/jwt';
import { sendError } from '@/utils/response';
import { AuthenticatedRequest } from '@/types';

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Access token required', undefined, 401);
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      return sendError(res, 'Access token required', undefined, 401);
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        return sendError(res, 'Access token expired', undefined, 401);
      }
      if (error.name === 'JsonWebTokenError') {
        return sendError(res, 'Invalid access token', undefined, 401);
      }
    }
    
    return sendError(res, 'Authentication failed', undefined, 401);
  }
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (token) {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};