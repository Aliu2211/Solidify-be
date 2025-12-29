import { body, param, query } from 'express-validator';

export const createResourceValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),

  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['template', 'regulatory', 'case-study', 'guide', 'report', 'video', 'webinar'])
    .withMessage(
      'Category must be one of: template, regulatory, case-study, guide, report, video, webinar'
    ),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags: string[]) => {
      if (tags.length > 20) {
        throw new Error('Cannot have more than 20 tags');
      }
      return true;
    }),

  body('tags.*').trim().notEmpty().withMessage('Tag cannot be empty'),

  body('fileType')
    .notEmpty()
    .withMessage('File type is required')
    .isIn(['pdf', 'xlsx', 'docx', 'pptx', 'video', 'link'])
    .withMessage('File type must be one of: pdf, xlsx, docx, pptx, video, link'),

  body('fileUrl')
    .trim()
    .notEmpty()
    .withMessage('File URL is required')
    .isURL({ require_protocol: true })
    .withMessage('File URL must be a valid URL (e.g., https://example.com/file.pdf)'),

  body('fileSize')
    .optional()
    .isInt({ min: 0 })
    .withMessage('File size must be a positive number'),

  body('thumbnailUrl')
    .optional()
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('Thumbnail URL must be a valid URL'),

  body('level')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage('Level must be 1, 2, or 3'),

  body('industry')
    .optional()
    .isArray()
    .withMessage('Industry must be an array'),

  body('industry.*').trim().notEmpty().withMessage('Industry value cannot be empty'),

  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean'),

  body('isPremium')
    .optional()
    .isBoolean()
    .withMessage('isPremium must be a boolean'),

  body('version')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Version must not exceed 50 characters'),

  body('publishedDate')
    .optional()
    .isISO8601()
    .withMessage('Published date must be a valid date'),
];

export const updateResourceValidator = [
  param('id').isMongoId().withMessage('Invalid resource ID'),

  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),

  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty')
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),

  body('category')
    .optional()
    .isIn(['template', 'regulatory', 'case-study', 'guide', 'report', 'video', 'webinar'])
    .withMessage(
      'Category must be one of: template, regulatory, case-study, guide, report, video, webinar'
    ),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags: string[]) => {
      if (tags.length > 20) {
        throw new Error('Cannot have more than 20 tags');
      }
      return true;
    }),

  body('fileType')
    .optional()
    .isIn(['pdf', 'xlsx', 'docx', 'pptx', 'video', 'link'])
    .withMessage('File type must be one of: pdf, xlsx, docx, pptx, video, link'),

  body('fileUrl')
    .optional()
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('File URL must be a valid URL'),

  body('fileSize')
    .optional()
    .isInt({ min: 0 })
    .withMessage('File size must be a positive number'),

  body('thumbnailUrl')
    .optional()
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('Thumbnail URL must be a valid URL'),

  body('level')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage('Level must be 1, 2, or 3'),

  body('industry')
    .optional()
    .isArray()
    .withMessage('Industry must be an array'),

  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean'),

  body('isPremium')
    .optional()
    .isBoolean()
    .withMessage('isPremium must be a boolean'),

  body('version')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Version must not exceed 50 characters'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

export const getResourceByIdValidator = [
  param('id').isMongoId().withMessage('Invalid resource ID'),
];

export const deleteResourceValidator = [
  param('id').isMongoId().withMessage('Invalid resource ID'),
];

export const getResourcesValidator = [
  query('category')
    .optional()
    .isIn(['template', 'regulatory', 'case-study', 'guide', 'report', 'video', 'webinar'])
    .withMessage(
      'Category must be one of: template, regulatory, case-study, guide, report, video, webinar'
    ),

  query('level')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage('Level must be 1, 2, or 3'),

  query('fileType')
    .optional()
    .isIn(['pdf', 'xlsx', 'docx', 'pptx', 'video', 'link'])
    .withMessage('File type must be one of: pdf, xlsx, docx, pptx, video, link'),

  query('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean'),

  query('isPremium')
    .optional()
    .isBoolean()
    .withMessage('isPremium must be a boolean'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

export const addFavoriteValidator = [
  param('id').isMongoId().withMessage('Invalid resource ID'),
];

export const removeFavoriteValidator = [
  param('id').isMongoId().withMessage('Invalid resource ID'),
];

export const downloadResourceValidator = [
  param('id').isMongoId().withMessage('Invalid resource ID'),
];
