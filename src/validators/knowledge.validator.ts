import { body } from 'express-validator';
import { SUSTAINABILITY_LEVELS } from '../utils/constants';

const VALID_CATEGORIES = [
  'carbon-tracking',
  'regulations',
  'best-practices',
  'case-studies',
  'tools',
];

const VALID_LEVELS = ['foundation', 'efficiency', 'transformation'];

export const createArticleValidator = [
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

  body('summary')
    .trim()
    .notEmpty()
    .withMessage('Summary is required')
    .isLength({ max: 500 })
    .withMessage('Summary must not exceed 500 characters'),

  body('sustainabilityLevel')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage('Sustainability level must be 1, 2, or 3'),

  body('level')
    .optional()
    .isIn(VALID_LEVELS)
    .withMessage('Level must be one of: foundation, efficiency, transformation'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(VALID_CATEGORIES)
    .withMessage(
      'Category must be one of: carbon-tracking, regulations, best-practices, case-studies, tools'
    ),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters'),

  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),

  // Custom validation to ensure either sustainabilityLevel or level is provided
  body().custom((value, { req }) => {
    if (!req.body.sustainabilityLevel && !req.body.level) {
      throw new Error('Either sustainabilityLevel or level must be provided');
    }
    return true;
  }),
];
