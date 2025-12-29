import { Router } from 'express';
import { LibraryController } from '../controllers/library.controller';
import { authenticate, adminOnly } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createResourceValidator,
  updateResourceValidator,
  getResourceByIdValidator,
  deleteResourceValidator,
  getResourcesValidator,
  addFavoriteValidator,
  removeFavoriteValidator,
  downloadResourceValidator,
} from '../validators/library.validator';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Library (Admin)
 *     description: Library resource management endpoints (Admin only)
 *   - name: Library
 *     description: Library resource access and favorites endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LibraryResource:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Resource MongoDB ID
 *         resourceId:
 *           type: string
 *           example: LIB000001
 *           description: Unique resource identifier
 *         title:
 *           type: string
 *           example: GHG Protocol Corporate Standard
 *           description: Resource title
 *         description:
 *           type: string
 *           description: Resource description
 *         category:
 *           type: string
 *           enum: [template, regulatory, case-study, guide, report, video, webinar]
 *           description: Resource category
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["emissions", "scope-1", "measurement"]
 *           description: Resource tags
 *         fileType:
 *           type: string
 *           enum: [pdf, xlsx, docx, pptx, video, link]
 *           description: File type
 *         fileUrl:
 *           type: string
 *           format: uri
 *           description: File download URL
 *         fileSize:
 *           type: number
 *           description: File size in bytes
 *         thumbnailUrl:
 *           type: string
 *           format: uri
 *           description: Thumbnail image URL
 *         level:
 *           type: number
 *           enum: [1, 2, 3]
 *           description: Related sustainability level
 *         industry:
 *           type: array
 *           items:
 *             type: string
 *           description: Relevant industries
 *         uploadedBy:
 *           type: string
 *           description: ID of admin who uploaded
 *         downloadCount:
 *           type: number
 *           description: Number of downloads
 *         viewCount:
 *           type: number
 *           description: Number of views
 *         isFeatured:
 *           type: boolean
 *           description: Whether resource is featured
 *         isPremium:
 *           type: boolean
 *           description: Whether resource requires premium access
 *         version:
 *           type: string
 *           description: Version number (for regulatory docs)
 *         publishedDate:
 *           type: string
 *           format: date-time
 *           description: Publication date
 *         isActive:
 *           type: boolean
 *           description: Whether resource is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// ========================================
// ADMIN ROUTES - Resource Management
// ========================================

/**
 * @swagger
 * /library/resources:
 *   post:
 *     summary: Create a new library resource
 *     description: Upload a new resource to the library (Admin only)
 *     tags: [Library (Admin)]
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
 *               - description
 *               - category
 *               - fileType
 *               - fileUrl
 *             properties:
 *               title:
 *                 type: string
 *                 example: GHG Protocol Corporate Standard
 *               description:
 *                 type: string
 *                 example: The foundational standard for measuring corporate greenhouse gas emissions
 *               category:
 *                 type: string
 *                 enum: [template, regulatory, case-study, guide, report, video, webinar]
 *                 example: regulatory
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["ghg", "emissions", "protocol"]
 *               fileType:
 *                 type: string
 *                 enum: [pdf, xlsx, docx, pptx, video, link]
 *                 example: pdf
 *               fileUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://s3.amazonaws.com/resources/ghg-protocol.pdf
 *               fileSize:
 *                 type: number
 *                 example: 2048000
 *               thumbnailUrl:
 *                 type: string
 *                 format: uri
 *               level:
 *                 type: number
 *                 enum: [1, 2, 3]
 *                 example: 1
 *               industry:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["manufacturing", "energy"]
 *               isFeatured:
 *                 type: boolean
 *                 example: false
 *               isPremium:
 *                 type: boolean
 *                 example: false
 *               version:
 *                 type: string
 *                 example: "1.0"
 *     responses:
 *       201:
 *         description: Resource created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Resource already exists
 */
router.post(
  '/resources',
  authenticate,
  adminOnly,
  createResourceValidator,
  validate,
  LibraryController.createResource
);

/**
 * @swagger
 * /library/resources:
 *   get:
 *     summary: Get all library resources
 *     description: Browse library resources with filtering and search
 *     tags: [Library]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [template, regulatory, case-study, guide, report, video, webinar]
 *         description: Filter by category
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated tags to filter by
 *         example: "emissions,scope-1"
 *       - in: query
 *         name: level
 *         schema:
 *           type: number
 *           enum: [1, 2, 3]
 *         description: Filter by sustainability level
 *       - in: query
 *         name: fileType
 *         schema:
 *           type: string
 *           enum: [pdf, xlsx, docx, pptx, video, link]
 *         description: Filter by file type
 *       - in: query
 *         name: industry
 *         schema:
 *           type: string
 *         description: Comma-separated industries to filter by
 *       - in: query
 *         name: isFeatured
 *         schema:
 *           type: boolean
 *         description: Filter featured resources
 *       - in: query
 *         name: isPremium
 *         schema:
 *           type: boolean
 *         description: Filter premium resources
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title, description, and tags
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *         description: Items per page (max 100)
 *     responses:
 *       200:
 *         description: Resources retrieved successfully
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
 *                     $ref: '#/components/schemas/LibraryResource'
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
router.get(
  '/resources',
  authenticate,
  getResourcesValidator,
  validate,
  LibraryController.getResources
);

/**
 * @swagger
 * /library/resources/{id}:
 *   get:
 *     summary: Get resource by ID
 *     description: Retrieve a single library resource with full details
 *     tags: [Library]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource MongoDB ID
 *     responses:
 *       200:
 *         description: Resource retrieved successfully
 *       404:
 *         description: Resource not found
 */
router.get(
  '/resources/:id',
  authenticate,
  getResourceByIdValidator,
  validate,
  LibraryController.getResourceById
);

/**
 * @swagger
 * /library/resources/{id}:
 *   put:
 *     summary: Update a library resource
 *     description: Update resource details (Admin only)
 *     tags: [Library (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource MongoDB ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [template, regulatory, case-study, guide, report, video, webinar]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               fileType:
 *                 type: string
 *                 enum: [pdf, xlsx, docx, pptx, video, link]
 *               fileUrl:
 *                 type: string
 *               fileSize:
 *                 type: number
 *               thumbnailUrl:
 *                 type: string
 *               level:
 *                 type: number
 *                 enum: [1, 2, 3]
 *               industry:
 *                 type: array
 *                 items:
 *                   type: string
 *               isFeatured:
 *                 type: boolean
 *               isPremium:
 *                 type: boolean
 *               version:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Resource updated successfully
 *       404:
 *         description: Resource not found
 */
router.put(
  '/resources/:id',
  authenticate,
  adminOnly,
  updateResourceValidator,
  validate,
  LibraryController.updateResource
);

/**
 * @swagger
 * /library/resources/{id}:
 *   delete:
 *     summary: Delete a library resource
 *     description: Soft delete a resource (Admin only)
 *     tags: [Library (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource MongoDB ID
 *     responses:
 *       200:
 *         description: Resource deleted successfully
 *       404:
 *         description: Resource not found
 */
router.delete(
  '/resources/:id',
  authenticate,
  adminOnly,
  deleteResourceValidator,
  validate,
  LibraryController.deleteResource
);

// ========================================
// USER ROUTES - Resource Access
// ========================================

/**
 * @swagger
 * /library/resources/{id}/download:
 *   get:
 *     summary: Download a resource
 *     description: Get download URL for a resource (increments download count)
 *     tags: [Library]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource MongoDB ID
 *     responses:
 *       200:
 *         description: Download URL retrieved successfully
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
 *                     fileUrl:
 *                       type: string
 *                     fileName:
 *                       type: string
 *                     fileType:
 *                       type: string
 *       404:
 *         description: Resource not found
 */
router.get(
  '/resources/:id/download',
  authenticate,
  downloadResourceValidator,
  validate,
  LibraryController.downloadResource
);

/**
 * @swagger
 * /library/resources/{id}/favorite:
 *   post:
 *     summary: Add resource to favorites
 *     description: Bookmark a resource for quick access
 *     tags: [Library]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource MongoDB ID
 *     responses:
 *       201:
 *         description: Resource added to favorites
 *       400:
 *         description: Resource already in favorites
 *       404:
 *         description: Resource not found
 */
router.post(
  '/resources/:id/favorite',
  authenticate,
  addFavoriteValidator,
  validate,
  LibraryController.addFavorite
);

/**
 * @swagger
 * /library/resources/{id}/favorite:
 *   delete:
 *     summary: Remove resource from favorites
 *     description: Remove a bookmarked resource
 *     tags: [Library]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource MongoDB ID
 *     responses:
 *       200:
 *         description: Resource removed from favorites
 *       404:
 *         description: Favorite not found
 */
router.delete(
  '/resources/:id/favorite',
  authenticate,
  removeFavoriteValidator,
  validate,
  LibraryController.removeFavorite
);

/**
 * @swagger
 * /library/my-favorites:
 *   get:
 *     summary: Get my favorite resources
 *     description: Retrieve all resources bookmarked by current user
 *     tags: [Library]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favorites retrieved successfully
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
 *                     type: object
 */
router.get('/my-favorites', authenticate, LibraryController.getMyFavorites);

/**
 * @swagger
 * /library/popular:
 *   get:
 *     summary: Get popular resources
 *     description: Retrieve most downloaded and viewed resources
 *     tags: [Library]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Number of resources to return
 *     responses:
 *       200:
 *         description: Popular resources retrieved successfully
 */
router.get('/popular', authenticate, LibraryController.getPopularResources);

/**
 * @swagger
 * /library/recent:
 *   get:
 *     summary: Get recently added resources
 *     description: Retrieve the most recently published resources
 *     tags: [Library]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Number of resources to return
 *     responses:
 *       200:
 *         description: Recent resources retrieved successfully
 */
router.get('/recent', authenticate, LibraryController.getRecentResources);

/**
 * @swagger
 * /library/recommended:
 *   get:
 *     summary: Get recommended resources
 *     description: Get resources recommended based on user's current sustainability level
 *     tags: [Library]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recommended resources retrieved successfully
 */
router.get('/recommended', authenticate, LibraryController.getRecommendedResources);

/**
 * @swagger
 * /library/categories:
 *   get:
 *     summary: Get all categories
 *     description: Get all resource categories with resource counts
 *     tags: [Library]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */
router.get('/categories', authenticate, LibraryController.getCategories);

export default router;
