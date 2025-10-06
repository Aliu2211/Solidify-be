import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiResponseUtil } from '../utils/response';

/**
 * Validation middleware - Checks express-validator results
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.type === 'field' ? (error as any).path : 'unknown',
      message: error.msg,
    }));

    ApiResponseUtil.badRequest(res, 'Validation failed', errorMessages);
    return;
  }

  next();
};
