import { Request, Response, NextFunction } from 'express';
import { sendError } from '@/utils/response';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Prisma specific errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    
    if (prismaError.code === 'P2002') {
      statusCode = 409;
      message = 'Resource already exists';
    } else if (prismaError.code === 'P2025') {
      statusCode = 404;
      message = 'Resource not found';
    }
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    statusCode = 422;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication failed';
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  sendError(res, message, err.message, statusCode);
};

export const notFoundHandler = (req: Request, res: Response) => {
  sendError(res, 'Route not found', `Cannot ${req.method} ${req.path}`, 404);
};