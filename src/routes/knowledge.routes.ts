import { Router } from 'express';
import { KnowledgeController } from '../controllers/knowledge.controller';
import { authenticate, adminOrManager } from '../middleware/auth.middleware';
import { createArticleValidator } from '../validators/knowledge.validator';
import { validate } from '../middleware/validate.middleware';

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
 *               - summary
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: Understanding Scope 1, 2, and 3 Emissions
 *               content:
 *                 type: string
 *                 example: Detailed content about emission scopes...
 *               summary:
 *                 type: string
 *                 maxLength: 500
 *                 example: A comprehensive guide to understanding the three scopes of carbon emissions
 *               category:
 *                 type: string
 *                 enum: [carbon-tracking, regulations, best-practices, case-studies, tools]
 *                 example: carbon-tracking
 *               sustainabilityLevel:
 *                 type: number
 *                 enum: [1, 2, 3]
 *                 description: Sustainability level (1=foundation, 2=efficiency, 3=transformation)
 *                 example: 1
 *               level:
 *                 type: string
 *                 enum: [foundation, efficiency, transformation]
 *                 description: Alternative to sustainabilityLevel (will be converted to number)
 *                 example: foundation
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["emissions", "carbon", "basics"]
 *               featured:
 *                 type: boolean
 *                 default: false
 *                 example: false
 *     responses:
 *       201:
 *         description: Article created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KnowledgeArticle'
 */
router.post('/articles', authenticate, adminOrManager, createArticleValidator, validate, KnowledgeController.createArticle);

export default router;
