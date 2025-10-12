import { body } from 'express-validator';
import { NEWS_CATEGORIES } from '../utils/constants';

const VALID_CATEGORIES = Object.values(NEWS_CATEGORIES);

export const createNewsValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters'),

  // Accept either 'summary' or 'excerpt' for backward compatibility
  body()
    .custom((value, { req }) => {
      const summary = req.body.summary || req.body.excerpt;
      if (!summary || summary.trim().length === 0) {
        throw new Error('Summary is required');
      }
      if (summary.length > 500) {
        throw new Error('Summary must not exceed 500 characters');
      }
      return true;
    }),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(VALID_CATEGORIES)
    .withMessage(
      `Category must be one of: ${VALID_CATEGORIES.join(', ')}`
    ),

  body('imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Image URL must be a valid URL'),

  body('coverImage')
    .optional()
    .trim()
    .isURL()
    .withMessage('Cover image must be a valid URL'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters'),

  body('source')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Source must be between 1 and 200 characters'),

  body('sourceUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Source URL must be a valid URL'),

  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
];
