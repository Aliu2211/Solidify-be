import { Router } from 'express';
import { LearningController } from '../controllers/learning.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Learning
 *   description: User learning and progress tracking endpoints
 */

/**
 * @swagger
 * /learning/my-progress:
 *   get:
 *     summary: Get my learning progress
 *     description: Retrieve current user's learning progress and statistics
 *     tags: [Learning]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Learning progress retrieved successfully
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
 *                     currentLevel:
 *                       type: number
 *                       example: 1
 *                     totalCoursesInLevel:
 *                       type: number
 *                       example: 10
 *                     completedInLevel:
 *                       type: number
 *                       example: 5
 *                     progressPercentage:
 *                       type: number
 *                       example: 50
 *                     coursesInProgress:
 *                       type: array
 *                       items:
 *                         type: object
 *                     completedCourses:
 *                       type: array
 *                       items:
 *                         type: object
 *                     availableCourses:
 *                       type: array
 *                       items:
 *                         type: object
 */
router.get('/my-progress', authenticate, LearningController.getMyProgress);

/**
 * @swagger
 * /learning/organization-progress:
 *   get:
 *     summary: Get organization learning progress
 *     description: Retrieve organization-wide learning progress and statistics
 *     tags: [Learning]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Organization progress retrieved successfully
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
 *                     organization:
 *                       type: object
 *                       description: Organization details
 *                     currentLevel:
 *                       type: number
 *                       example: 1
 *                     activeUsers:
 *                       type: number
 *                       example: 25
 *                     levelProgress:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           level:
 *                             type: number
 *                           totalCourses:
 *                             type: number
 *                           completedByAllUsers:
 *                             type: number
 *                           progressPercentage:
 *                             type: number
 *                           unlockedAt:
 *                             type: string
 *                             format: date-time
 *                           completedAt:
 *                             type: string
 *                             format: date-time
 */
router.get('/organization-progress', authenticate, LearningController.getOrganizationProgress);

/**
 * @swagger
 * /learning/leaderboard:
 *   get:
 *     summary: Get learning leaderboard
 *     description: Retrieve top learners in the organization
 *     tags: [Learning]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leaderboard retrieved successfully
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
 *                     properties:
 *                       userId:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       avatarUrl:
 *                         type: string
 *                       coursesCompleted:
 *                         type: number
 *                       learningLevel:
 *                         type: number
 */
router.get('/leaderboard', authenticate, LearningController.getLeaderboard);

export default router;
