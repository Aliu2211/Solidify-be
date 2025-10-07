import { Router } from 'express';
import { CarbonController } from '../controllers/carbon.controller';
import { createCarbonEntryValidator, createGoalValidator, updateRoadmapValidator, carbonQueryValidator } from '../validators/carbon.validator';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /carbon/entries:
 *   post:
 *     summary: Create a new carbon emission entry
 *     tags: [Carbon Tracking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entryDate
 *               - entryType
 *               - quantity
 *               - unit
 *               - emissionFactorId
 *             properties:
 *               entryDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-10-07
 *               entryType:
 *                 type: string
 *                 enum: [electricity, fuel, transport, waste, water, renewable_energy, carbon_offset]
 *                 example: electricity
 *               quantity:
 *                 type: number
 *                 example: 1500.5
 *               unit:
 *                 type: string
 *                 example: kWh
 *               emissionFactorId:
 *                 type: string
 *                 description: Get ID from /carbon/emission-factors endpoint
 *                 example: 68e51c2a9561b12c3ecdbba4
 *               sustainabilityLevel:
 *                 type: number
 *                 enum: [1, 2, 3]
 *                 example: 1
 *               notes:
 *                 type: string
 *                 example: Monthly electricity consumption
 *     responses:
 *       201:
 *         description: Carbon entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarbonEntry'
 */
router.post('/entries', createCarbonEntryValidator, validate, CarbonController.createEntry);

/**
 * @swagger
 * /carbon/entries:
 *   get:
 *     summary: Get carbon emission entries
 *     tags: [Carbon Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: number
 *           enum: [1, 2, 3]
 *         description: Filter by sustainability level
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date (YYYY-MM-DD)
 *         example: 2025-01-01
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date (YYYY-MM-DD)
 *         example: 2025-12-31
 *       - in: query
 *         name: entryType
 *         schema:
 *           type: string
 *           enum: [electricity, fuel, transport, waste, water, renewable_energy, carbon_offset]
 *         description: Filter by entry type
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *     responses:
 *       200:
 *         description: List of carbon entries
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
 *                     $ref: '#/components/schemas/CarbonEntry'
 *                 pagination:
 *                   type: object
 */
router.get('/entries', carbonQueryValidator, validate, CarbonController.getEntries);

/**
 * @swagger
 * /carbon/dashboard:
 *   get:
 *     summary: Get carbon dashboard summary
 *     tags: [Carbon Tracking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data with total emissions, trends, and breakdown
 */
router.get('/dashboard', CarbonController.getDashboard);

/**
 * @swagger
 * /carbon/roadmap:
 *   get:
 *     summary: Get organization sustainability roadmap
 *     tags: [Carbon Tracking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sustainability roadmap with milestones
 */
router.get('/roadmap', CarbonController.getRoadmap);

/**
 * @swagger
 * /carbon/roadmap/milestone:
 *   put:
 *     summary: Update roadmap milestone status
 *     tags: [Carbon Tracking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - milestoneNumber
 *               - completed
 *             properties:
 *               milestoneNumber:
 *                 type: number
 *                 enum: [1, 2, 3, 4, 5, 6]
 *                 example: 1
 *                 description: Milestone number (1-6)
 *               completed:
 *                 type: boolean
 *                 example: true
 *                 description: Mark milestone as completed or not
 *     responses:
 *       200:
 *         description: Milestone updated successfully
 */
router.put('/roadmap/milestone', updateRoadmapValidator, validate, CarbonController.updateMilestone);

/**
 * @swagger
 * /carbon/goals:
 *   post:
 *     summary: Create a carbon reduction goal
 *     tags: [Carbon Tracking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - level
 *               - targetYear
 *               - targetReductionPercentage
 *             properties:
 *               level:
 *                 type: number
 *                 enum: [1, 2, 3]
 *                 example: 1
 *                 description: Sustainability level (1-3)
 *               targetYear:
 *                 type: number
 *                 example: 2026
 *                 description: Target year (must be current year or later)
 *               targetReductionPercentage:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 20
 *                 description: Percentage reduction target (0-100)
 *     responses:
 *       201:
 *         description: Goal created successfully
 */
router.post('/goals', createGoalValidator, validate, CarbonController.createGoal);

/**
 * @swagger
 * /carbon/emission-factors:
 *   get:
 *     summary: Get emission factors for calculations
 *     tags: [Carbon Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: level
 *         schema:
 *           type: number
 *           enum: [1, 2, 3]
 *         description: Filter by sustainability level
 *     responses:
 *       200:
 *         description: List of emission factors
 */
router.get('/emission-factors', CarbonController.getEmissionFactors);

export default router;
