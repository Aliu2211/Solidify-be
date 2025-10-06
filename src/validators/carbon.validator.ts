import { body, query } from 'express-validator';

export const createCarbonEntryValidator = [
  body('entryDate')
    .notEmpty()
    .withMessage('Entry date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('entryType')
    .notEmpty()
    .withMessage('Entry type is required')
    .isIn(['electricity', 'fuel', 'transport', 'waste', 'water', 'renewable_energy', 'carbon_offset'])
    .withMessage('Invalid entry type'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isFloat({ min: 0 })
    .withMessage('Quantity must be a positive number'),
  body('unit')
    .trim()
    .notEmpty()
    .withMessage('Unit is required'),
  body('emissionFactorId')
    .notEmpty()
    .withMessage('Emission factor is required')
    .isMongoId()
    .withMessage('Invalid emission factor ID'),
  body('sustainabilityLevel')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage('Sustainability level must be 1, 2, or 3'),
];

export const createGoalValidator = [
  body('level')
    .notEmpty()
    .withMessage('Level is required')
    .isInt({ min: 1, max: 3 })
    .withMessage('Level must be 1, 2, or 3'),
  body('targetYear')
    .notEmpty()
    .withMessage('Target year is required')
    .isInt({ min: 2024 })
    .withMessage('Target year must be 2024 or later'),
  body('targetReductionPercentage')
    .notEmpty()
    .withMessage('Target reduction percentage is required')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Percentage must be between 0 and 100'),
  body('description')
    .optional()
    .trim(),
];

export const updateRoadmapValidator = [
  body('milestoneNumber')
    .notEmpty()
    .withMessage('Milestone number is required')
    .isInt({ min: 1, max: 6 })
    .withMessage('Milestone must be between 1 and 6'),
  body('completed')
    .notEmpty()
    .withMessage('Completed status is required')
    .isBoolean()
    .withMessage('Completed must be boolean'),
];

export const carbonQueryValidator = [
  query('level')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage('Level must be 1, 2, or 3'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date format'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date format'),
  query('entryType')
    .optional()
    .isIn(['electricity', 'fuel', 'transport', 'waste', 'water', 'renewable_energy', 'carbon_offset'])
    .withMessage('Invalid entry type'),
];
