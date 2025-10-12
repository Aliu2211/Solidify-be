import { Router } from 'express';
import { NewsController } from '../controllers/news.controller';
import { authenticate, adminOnly } from '../middleware/auth.middleware';
import { createNewsValidator } from '../validators/news.validator';
import { validate } from '../middleware/validate.middleware';

const router = Router();

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Get sustainability news articles
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [policy, technology, success-stories, events, global-trends]
 *         description: Filter by category
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *     responses:
 *       200:
 *         description: List of news articles
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
 *                     $ref: '#/components/schemas/NewsArticle'
 */
router.get('/', NewsController.getNews);

/**
 * @swagger
 * /news/{slug}:
 *   get:
 *     summary: Get a single news article by slug
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: News article slug
 *         example: ghana-carbon-credit-initiative
 *     responses:
 *       200:
 *         description: News article details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/NewsArticle'
 */
router.get('/:slug', NewsController.getNewsArticle);

/**
 * @swagger
 * /news:
 *   post:
 *     summary: Create a new news article (Admin only)
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - summary
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: Ghana Launches New Carbon Credit Initiative
 *               content:
 *                 type: string
 *                 example: Full article content...
 *               summary:
 *                 type: string
 *                 maxLength: 500
 *                 example: Ghana's government announces new carbon credit program
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *               category:
 *                 type: string
 *                 enum: [policy, technology, success-stories, events, global-trends]
 *                 example: policy
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["ghana", "carbon-credits", "policy"]
 *               source:
 *                 type: string
 *                 example: Ghana Ministry of Environment
 *               sourceUrl:
 *                 type: string
 *                 example: https://example.com/source
 *               featured:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: News article created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewsArticle'
 */
router.post('/', authenticate, adminOnly, createNewsValidator, validate, NewsController.createNews);

export default router;
