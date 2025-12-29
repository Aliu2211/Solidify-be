import { Router } from 'express';
import authRoutes from './auth.routes';
import carbonRoutes from './carbon.routes';
import chatRoutes from './chat.routes';
import knowledgeRoutes from './knowledge.routes';
import newsRoutes from './news.routes';
import organizationRoutes from './organization.routes';
import courseRoutes from './course.routes';
import learningRoutes from './learning.routes';
import libraryRoutes from './library.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/carbon', carbonRoutes);
router.use('/chat', chatRoutes);
router.use('/knowledge', knowledgeRoutes);
router.use('/news', newsRoutes);
router.use('/organizations', organizationRoutes);
router.use('/courses', courseRoutes);
router.use('/learning', learningRoutes);
router.use('/library', libraryRoutes);
router.use('/users', userRoutes);

export default router;
