import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/conversations', ChatController.getConversations);
router.post('/conversations', ChatController.createConversation);
router.get('/conversations/:id/messages', ChatController.getMessages);
router.post('/messages', ChatController.sendMessage);

export default router;
