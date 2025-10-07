import { Router } from 'express';
import { KnowledgeController } from '../controllers/knowledge.controller';
import { authenticate, adminOrManager } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /knowledge/articles:
 *   get:
 *     summary: Get knowledge base articles
 *     tags: [Knowledge Base]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [carbon-tracking, regulations, best-practices, case-studies, tools]
 *         description: Filter by category
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [foundation, efficiency, transformation]
 *         description: Filter by sustainability level
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
 *         description: List of articles
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
 *                     $ref: '#/components/schemas/KnowledgeArticle'
 */
router.get('/articles', KnowledgeController.getArticles);

/**
 * @swagger
 * /knowledge/articles/{slug}:
 *   get:
 *     summary: Get a single article by slug
 *     tags: [Knowledge Base]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Article slug
 *         example: understanding-scope-emissions
 *     responses:
 *       200:
 *         description: Article details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/KnowledgeArticle'
 */
router.get('/articles/:slug', KnowledgeController.getArticle);

/**
 * @swagger
 * /knowledge/search:
 *   get:
 *     summary: Search knowledge base articles
 *     tags: [Knowledge Base]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *         example: carbon footprint
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
 *         description: Search results
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
 *                     $ref: '#/components/schemas/KnowledgeArticle'
 */
router.get('/search', KnowledgeController.searchArticles);

/**
 * @swagger
 * /knowledge/articles:
 *   post:
 *     summary: Create a new knowledge article (Admin/Manager only)
 *     tags: [Knowledge Base]
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
 *               - category
 *               - level
 *             properties:
 *               title:
 *                 type: string
 *                 example: Understanding Scope 1, 2, and 3 Emissions
 *               content:
 *                 type: string
 *                 example: Detailed content about emission scopes...
 *               category:
 *                 type: string
 *                 enum: [carbon-tracking, regulations, best-practices, case-studies, tools]
 *                 example: carbon-tracking
 *               level:
 *                 type: string
 *                 enum: [foundation, efficiency, transformation]
 *                 example: foundation
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["emissions", "carbon", "basics"]
 *     responses:
 *       201:
 *         description: Article created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KnowledgeArticle'
 */
router.post('/articles', authenticate, adminOrManager, KnowledgeController.createArticle);

export default router;
