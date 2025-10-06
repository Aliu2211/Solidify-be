import { Router } from 'express';
import authRoutes from './auth.routes';
import carbonRoutes from './carbon.routes';
import chatRoutes from './chat.routes';
import knowledgeRoutes from './knowledge.routes';
import newsRoutes from './news.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/carbon', carbonRoutes);
router.use('/chat', chatRoutes);
router.use('/knowledge', knowledgeRoutes);
router.use('/news', newsRoutes);

export default router;
