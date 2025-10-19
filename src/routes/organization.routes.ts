import { Router } from 'express';
import { OrganizationController } from '../controllers/organization.controller';
import { authenticate, adminOnly } from '../middleware/auth.middleware';
import { connectWithOrganizationValidator } from '../validators/organization.validator';
import { validate } from '../middleware/validate.middleware';

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

/**
 * @swagger
 * /organizations/{id}/users:
 *   get:
 *     summary: Get all users from a specific organization
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
 *         example: 68e4fddf48b66e92d9ef1f88
 *     responses:
 *       200:
 *         description: List of users from the organization
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Organization users retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 68e51c2a9561b12c3ecdbba0
 *                       userId:
 *                         type: string
 *                         example: SME000001
 *                       firstName:
 *                         type: string
 *                         example: John
 *                       lastName:
 *                         type: string
 *                         example: Doe
 *                       email:
 *                         type: string
 *                         example: john.doe@company.com
 *                       role:
 *                         type: string
 *                         enum: [admin, manager, user]
 *                         example: admin
 *                       avatarUrl:
 *                         type: string
 *                         nullable: true
 *       404:
 *         description: Organization not found
 */
router.get('/:id/users', authenticate, OrganizationController.getOrganizationUsers);

/**
 * @swagger
 * /organizations/{id}/connect:
 *   post:
 *     summary: Connect with an organization (create conversation)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Target organization ID
 *         example: 68e4fddf48b66e92d9ef1f88
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               connectType:
 *                 type: string
 *                 enum: [organization, user]
 *                 default: organization
 *                 description: Type of connection - 'organization' for group chat, 'user' for direct chat
 *                 example: organization
 *               userId:
 *                 type: string
 *                 description: Required when connectType is 'user'. ID of the user to chat with
 *                 example: 68e51c2a9561b12c3ecdbba0
 *           examples:
 *             organizationChat:
 *               summary: Connect with entire organization (group chat)
 *               value:
 *                 connectType: organization
 *             userChat:
 *               summary: Connect with specific user (direct chat)
 *               value:
 *                 connectType: user
 *                 userId: 68e51c2a9561b12c3ecdbba0
 *     responses:
 *       201:
 *         description: Conversation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Direct conversation created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Conversation'
 *       200:
 *         description: Conversation already exists
 *       400:
 *         description: Bad request (e.g., trying to connect to own organization)
 *       404:
 *         description: Organization or user not found
 */
router.post('/:id/connect', authenticate, connectWithOrganizationValidator, validate, OrganizationController.connectWithOrganization);

export default router;
