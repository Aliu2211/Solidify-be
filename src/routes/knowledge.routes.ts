import { Router } from 'express';
import { KnowledgeController } from '../controllers/knowledge.controller';
import { authenticate, adminOrManager } from '../middleware/auth.middleware';

const router = Router();

router.get('/articles', KnowledgeController.getArticles);
router.get('/articles/:slug', KnowledgeController.getArticle);
router.get('/search', KnowledgeController.searchArticles);
router.post('/articles', authenticate, adminOrManager, KnowledgeController.createArticle);

export default router;
