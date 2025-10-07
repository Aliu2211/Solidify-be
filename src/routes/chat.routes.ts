import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /chat/conversations:
 *   get:
 *     summary: Get all chat conversations
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       participants:
 *                         type: array
 *                         items:
 *                           type: object
 *                       lastMessage:
 *                         type: object
 */
router.get('/conversations', ChatController.getConversations);

/**
 * @swagger
 * /chat/conversations:
 *   post:
 *     summary: Create a new conversation
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
 *               - participantIds
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [direct, group]
 *                 example: direct
 *                 description: Conversation type (direct for 1-on-1, group for multiple users)
 *               name:
 *                 type: string
 *                 example: Project Discussion
 *                 description: Optional name for group conversations
 *               participantIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["68e51c2a9561b12c3ecdbba0"]
 *                 description: Array of user IDs to add to the conversation (excludes yourself)
 *     responses:
 *       201:
 *         description: Conversation created successfully
 */
router.post('/conversations', ChatController.createConversation);

/**
 * @swagger
 * /chat/conversations/{id}/messages:
 *   get:
 *     summary: Get messages in a conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation ID
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
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 */
router.get('/conversations/:id/messages', ChatController.getMessages);

/**
 * @swagger
 * /chat/messages:
 *   post:
 *     summary: Send a message in a conversation
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
 *                 example: 507f1f77bcf86cd799439011
 *               content:
 *                 type: string
 *                 example: Hello, how can we collaborate?
 *               messageType:
 *                 type: string
 *                 enum: [text, file, image]
 *                 default: text
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */
router.post('/messages', ChatController.sendMessage);

export default router;
