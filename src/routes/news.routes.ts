import { Router } from 'express';
import { NewsController } from '../controllers/news.controller';
import { authenticate, adminOnly } from '../middleware/auth.middleware';

const router = Router();

router.get('/', NewsController.getNews);
router.get('/:slug', NewsController.getNewsArticle);
router.post('/', authenticate, adminOnly, NewsController.createNews);

export default router;
