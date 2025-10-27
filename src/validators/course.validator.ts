import { body, param, query } from 'express-validator';
import { SUSTAINABILITY_LEVELS, COMPLETION_CRITERIA_TYPES, RESOURCE_TYPES } from '../utils/constants';

export const createCourseValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),

  body('level')
    .isInt({ min: 1, max: 3 })
    .withMessage('Level must be 1, 2, or 3'),

  body('orderInLevel')
    .isInt({ min: 1 })
    .withMessage('Order in level must be at least 1'),

  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 minute'),

  body('thumbnail')
    .optional()
    .isURL()
    .withMessage('Thumbnail must be a valid URL'),

  body('completionCriteria.type')
    .isIn(Object.values(COMPLETION_CRITERIA_TYPES))
    .withMessage(`Completion criteria type must be one of: ${Object.values(COMPLETION_CRITERIA_TYPES).join(', ')}`),

  body('completionCriteria.passingScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Passing score must be between 0 and 100'),

  body('completionCriteria.requiredTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Required time must be positive'),

  body('resources')
    .optional()
    .isArray()
    .withMessage('Resources must be an array'),

  body('resources.*.title')
    .if(body('resources').exists())
    .trim()
    .notEmpty()
    .withMessage('Resource title is required'),

  body('resources.*.url')
    .if(body('resources').exists())
    .trim()
    .notEmpty()
    .withMessage('Resource URL is required')
    .isURL({ require_protocol: true })
    .withMessage('Resource URL must be a valid URL (e.g., https://example.com)'),

  body('resources.*.type')
    .if(body('resources').exists())
    .isIn(Object.values(RESOURCE_TYPES))
    .withMessage(`Resource type must be one of: ${Object.values(RESOURCE_TYPES).join(', ')}`),
];

export const updateCourseValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid course ID'),

  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),

  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Content cannot be empty'),

  body('level')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage('Level must be 1, 2, or 3'),

  body('orderInLevel')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Order in level must be at least 1'),

  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 minute'),

  body('thumbnail')
    .optional()
    .isURL()
    .withMessage('Thumbnail must be a valid URL'),

  body('completionCriteria.type')
    .optional()
    .isIn(Object.values(COMPLETION_CRITERIA_TYPES))
    .withMessage(`Completion criteria type must be one of: ${Object.values(COMPLETION_CRITERIA_TYPES).join(', ')}`),

  body('completionCriteria.passingScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Passing score must be between 0 and 100'),

  body('completionCriteria.requiredTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Required time must be positive'),

  body('resources')
    .optional()
    .isArray()
    .withMessage('Resources must be an array'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

export const getCourseByIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid course ID'),
];

export const deleteCourseValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid course ID'),
];

export const getCoursesValidator = [
  query('level')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage('Level must be 1, 2, or 3'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be at least 1'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

export const startCourseValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid course ID'),
];

export const completeCourseValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid course ID'),

  body('timeSpent')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Time spent must be positive'),

  body('quizScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Quiz score must be between 0 and 100'),
];
