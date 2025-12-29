import { body } from 'express-validator';

export const connectWithOrganizationValidator = [
  body('connectType')
    .optional()
    .isIn(['organization', 'user'])
    .withMessage('Connect type must be either "organization" or "user"'),

  body('userId')
    .optional()
    .isMongoId()
    .withMessage('User ID must be a valid MongoDB ObjectId'),

  // Custom validation: userId is required when connectType is 'user'
  body().custom((value, { req }) => {
    if (req.body.connectType === 'user' && !req.body.userId) {
      throw new Error('User ID is required when connect type is "user"');
    }
    return true;
  }),
];
