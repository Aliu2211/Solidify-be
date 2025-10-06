import { Request, Response, NextFunction } from 'express';
import { ApiResponseUtil } from '../utils/response';
import logger from '../utils/logger';
import config from '../config/environment';

export interface CustomError extends Error {
  statusCode?: number;
  errors?: any[];
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values((err as any).errors).map((e: any) => e.message);
    ApiResponseUtil.badRequest(res, 'Validation failed', errors);
    return;
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyPattern)[0];
    ApiResponseUtil.conflict(res, `${field} already exists`);
    return;
  }

  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    ApiResponseUtil.badRequest(res, 'Invalid ID format');
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    ApiResponseUtil.unauthorized(res, 'Invalid token');
    return;
  }

  if (err.name === 'TokenExpiredError') {
    ApiResponseUtil.unauthorized(res, 'Token expired');
    return;
  }

  // Custom error with status code
  if (err.statusCode) {
    ApiResponseUtil.error(res, err.message, err.statusCode, err.errors);
    return;
  }

  // Default server error
  const message = config.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  ApiResponseUtil.serverError(res, message);
};

/**
 * 404 Not found handler
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  ApiResponseUtil.notFound(res, `Route ${req.originalUrl} not found`);
};

/**
 * Async handler wrapper
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
