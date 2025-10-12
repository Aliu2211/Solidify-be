import { body, param, query } from 'express-validator';
import { CONVERSATION_TYPES, MESSAGE_TYPES } from '../utils/constants';

/**
 * Validator for creating a conversation
 */
export const createConversationValidator = [
  body('type')
    .notEmpty()
    .withMessage('Conversation type is required')
    .isIn(Object.values(CONVERSATION_TYPES))
    .withMessage('Invalid conversation type. Must be "direct" or "group"'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Conversation name must be between 1 and 100 characters'),

  body('participantUserIds')
    .isArray({ min: 1 })
    .withMessage('At least one participant is required')
    .custom((value) => {
      if (!value.every((id: any) => typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/))) {
        throw new Error('Invalid participant user ID format');
      }
      return true;
    }),

  body('participantOrgIds')
    .isArray({ min: 1 })
    .withMessage('At least one participant organization is required')
    .custom((value) => {
      if (!value.every((id: any) => typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/))) {
        throw new Error('Invalid participant organization ID format');
      }
      return true;
    })
    .custom((orgIds, { req }) => {
      const userIds = req.body.participantUserIds || [];
      if (orgIds.length !== userIds.length) {
        throw new Error('Number of participant organizations must match number of participant users');
      }
      return true;
    }),
];

/**
 * Validator for sending a message
 */
export const sendMessageValidator = [
  body('conversationId')
    .notEmpty()
    .withMessage('Conversation ID is required')
    .isMongoId()
    .withMessage('Invalid conversation ID format'),

  body('content')
    .notEmpty()
    .withMessage('Message content is required')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Message content must be between 1 and 5000 characters'),

  body('messageType')
    .optional()
    .isIn(Object.values(MESSAGE_TYPES))
    .withMessage('Invalid message type. Must be "text", "file", or "image"'),

  body('fileUrl')
    .optional()
    .isURL()
    .withMessage('Invalid file URL format'),

  body('fileName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('File name must be between 1 and 255 characters'),
];

/**
 * Validator for getting conversation messages
 */
export const getConversationMessagesValidator = [
  param('id')
    .notEmpty()
    .withMessage('Conversation ID is required')
    .isMongoId()
    .withMessage('Invalid conversation ID format'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
];

/**
 * Validator for marking messages as read
 */
export const markAsReadValidator = [
  param('id')
    .notEmpty()
    .withMessage('Conversation ID is required')
    .isMongoId()
    .withMessage('Invalid conversation ID format'),
];

/**
 * Validator for getting conversations with filters
 */
export const getConversationsValidator = [
  query('type')
    .optional()
    .isIn(Object.values(CONVERSATION_TYPES))
    .withMessage('Invalid conversation type'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
];
