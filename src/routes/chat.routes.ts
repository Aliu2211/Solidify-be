import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createConversationValidator,
  sendMessageValidator,
  getConversationMessagesValidator,
  markAsReadValidator,
  getConversationsValidator,
} from '../validators/chat.validator';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /chat/conversations:
 *   get:
 *     summary: Get all conversations for the authenticated user
 *     description: Retrieves all active conversations where the user is a participant, supporting inter-organizational messaging
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [direct, group]
 *         description: Filter by conversation type
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *           maximum: 100
 *     responses:
 *       200:
 *         description: List of conversations with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Conversation'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     total:
 *                       type: number
 *                     totalPages:
 *                       type: number
 */
router.get('/conversations', getConversationsValidator, validate, ChatController.getConversations);

/**
 * @swagger
 * /chat/conversations:
 *   post:
 *     summary: Create a new inter-organizational conversation
 *     description: Creates a conversation between users from different organizations. Supports both direct (1-on-1) and group conversations.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - participantUserIds
 *               - participantOrgIds
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [direct, group]
 *                 example: direct
 *                 description: Conversation type - direct for 1-on-1, group for multiple participants
 *               name:
 *                 type: string
 *                 example: Carbon Reduction Partnership
 *                 description: Optional name for the conversation (recommended for group chats)
 *               participantUserIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["68e51c2a9561b12c3ecdbba0"]
 *                 description: Array of user IDs to include (you will be added automatically)
 *               participantOrgIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["68e4fddf48b66e92d9ef1f89"]
 *                 description: Array of organization IDs corresponding to each user (must match length of participantUserIds)
 *     responses:
 *       201:
 *         description: Conversation created successfully (or existing conversation returned)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Conversation'
 *       400:
 *         description: Validation error or participant not found
 */
router.post('/conversations', createConversationValidator, validate, ChatController.createConversation);

/**
 * @swagger
 * /chat/conversations/{id}/messages:
 *   get:
 *     summary: Get messages in a conversation
 *     description: Retrieves paginated messages from a conversation. Only participants can view messages.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation MongoDB ObjectId
 *         example: 68e51c2a9561b12c3ecdbba0
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 50
 *           maximum: 100
 *     responses:
 *       200:
 *         description: List of messages with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *                 pagination:
 *                   type: object
 *       403:
 *         description: Not a participant in this conversation
 *       404:
 *         description: Conversation not found
 */
router.get('/conversations/:id/messages', getConversationMessagesValidator, validate, ChatController.getMessages);

/**
 * @swagger
 * /chat/conversations/{id}/read:
 *   put:
 *     summary: Mark conversation messages as read
 *     description: Updates the lastReadAt timestamp for the authenticated user in this conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation MongoDB ObjectId
 *         example: 68e51c2a9561b12c3ecdbba0
 *     responses:
 *       200:
 *         description: Messages marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     lastReadAt:
 *                       type: string
 *                       format: date-time
 *       403:
 *         description: Not a participant in this conversation
 *       404:
 *         description: Conversation not found
 */
router.put('/conversations/:id/read', markAsReadValidator, validate, ChatController.markAsRead);

/**
 * @swagger
 * /chat/messages:
 *   post:
 *     summary: Send a message in a conversation
 *     description: Sends a text, file, or image message to a conversation. Only participants can send messages.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversationId
 *               - content
 *             properties:
 *               conversationId:
 *                 type: string
 *                 example: 68e51c2a9561b12c3ecdbba0
 *                 description: MongoDB ObjectId of the conversation
 *               content:
 *                 type: string
 *                 example: Hello! Let's discuss our carbon reduction strategies.
 *                 description: Message content (1-5000 characters)
 *               messageType:
 *                 type: string
 *                 enum: [text, file, image]
 *                 default: text
 *                 description: Type of message
 *               fileUrl:
 *                 type: string
 *                 example: https://res.cloudinary.com/demo/document.pdf
 *                 description: URL of attached file (for file/image types)
 *               fileName:
 *                 type: string
 *                 example: carbon-report-2025.pdf
 *                 description: Name of attached file (for file/image types)
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Message'
 *       400:
 *         description: Validation error
 *       403:
 *         description: Not a participant in this conversation
 *       404:
 *         description: Conversation not found
 */
router.post('/messages', sendMessageValidator, validate, ChatController.sendMessage);

export default router;
