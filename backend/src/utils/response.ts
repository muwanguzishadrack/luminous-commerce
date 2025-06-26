import { Response } from 'express';
import { ApiResponse } from '@/types';

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  error?: string,
  statusCode: number = 400
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    error,
  };
  res.status(statusCode).json(response);
};

export const sendValidationError = (
  res: Response,
  errors: any[],
  message: string = 'Validation failed'
): void => {
  res.status(422).json({
    success: false,
    message,
    errors,
  });
};