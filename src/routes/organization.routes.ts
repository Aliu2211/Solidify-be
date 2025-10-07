import { Router } from 'express';
import { OrganizationController } from '../controllers/organization.controller';
import { authenticate, adminOnly } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /organizations:
 *   get:
 *     summary: Get all organizations
 *     tags: [Organizations]
 *     responses:
 *       200:
 *         description: List of organizations
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
 *                     $ref: '#/components/schemas/Organization'
 */
router.get('/', OrganizationController.getAllOrganizations);

/**
 * @swagger
 * /organizations/{id}:
 *   get:
 *     summary: Get single organization
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: Organization details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Organization'
 */
router.get('/:id', OrganizationController.getOrganization);

/**
 * @swagger
 * /organizations:
 *   post:
 *     summary: Create new organization (Admin only)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - industryType
 *               - size
 *               - location
 *               - registrationNumber
 *             properties:
 *               name:
 *                 type: string
 *                 example: Green Energy Ghana Ltd
 *               industryType:
 *                 type: string
 *                 example: Renewable Energy
 *               size:
 *                 type: string
 *                 enum: [small, medium]
 *                 example: medium
 *               location:
 *                 type: string
 *                 example: Accra, Greater Accra, Ghana
 *               registrationNumber:
 *                 type: string
 *                 example: GH-123456789
 *               description:
 *                 type: string
 *                 example: Leading renewable energy provider in Ghana
 *               website:
 *                 type: string
 *                 example: https://greenenergy.gh
 *               logoUrl:
 *                 type: string
 *                 example: https://res.cloudinary.com/demo/image/upload/logo.jpg
 *     responses:
 *       201:
 *         description: Organization created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 */
router.post('/', authenticate, adminOnly, OrganizationController.createOrganization);

/**
 * @swagger
 * /organizations/{id}:
 *   put:
 *     summary: Update organization (Admin only)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               industry:
 *                 type: string
 *               size:
 *                 type: string
 *               location:
 *                 type: object
 *               contactEmail:
 *                 type: string
 *               contactPhone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Organization updated successfully
 */
router.put('/:id', authenticate, adminOnly, OrganizationController.updateOrganization);

/**
 * @swagger
 * /organizations/{id}:
 *   delete:
 *     summary: Delete organization (Admin only)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: Organization deleted successfully
 */
router.delete('/:id', authenticate, adminOnly, OrganizationController.deleteOrganization);

export default router;
