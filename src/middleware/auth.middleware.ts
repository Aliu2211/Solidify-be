import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { JWTService } from '../services/jwt.service';
import { ApiResponseUtil } from '../utils/response';
import { ERROR_MESSAGES, USER_ROLES } from '../utils/constants';

/**
 * Authentication middleware - Verify JWT token
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ApiResponseUtil.unauthorized(res, ERROR_MESSAGES.UNAUTHORIZED);
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const payload = JWTService.verifyAccessToken(token);

    if (!payload) {
      ApiResponseUtil.unauthorized(res, ERROR_MESSAGES.INVALID_TOKEN);
      return;
    }

    // Attach user to request
    req.user = payload;
    next();
  } catch (error) {
    ApiResponseUtil.unauthorized(res, ERROR_MESSAGES.INVALID_TOKEN);
  }
};

/**
 * Optional authentication - Doesn't fail if no token
 */
export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = JWTService.verifyAccessToken(token);

      if (payload) {
        req.user = payload;
      }
    }

    next();
  } catch (error) {
    next();
  }
};

/**
 * Role-based authorization middleware
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ApiResponseUtil.unauthorized(res, ERROR_MESSAGES.UNAUTHORIZED);
      return;
    }

    if (!roles.includes(req.user.role)) {
      ApiResponseUtil.forbidden(res, ERROR_MESSAGES.FORBIDDEN);
      return;
    }

    next();
  };
};

/**
 * Admin only middleware
 */
export const adminOnly = authorize(USER_ROLES.ADMIN);

/**
 * Admin or Manager middleware
 */
export const adminOrManager = authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER);
