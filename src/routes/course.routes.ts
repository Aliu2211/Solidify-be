import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { LearningController } from '../controllers/learning.controller';
import { authenticate, adminOnly } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createCourseValidator,
  updateCourseValidator,
  getCourseByIdValidator,
  deleteCourseValidator,
  getCoursesValidator,
  startCourseValidator,
  completeCourseValidator,
} from '../validators/course.validator';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Courses (Admin)
 *     description: Course management endpoints (Admin only)
 *   - name: Learning
 *     description: User learning and progress tracking endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CompletionCriteria:
 *       type: object
 *       required:
 *         - type
 *       properties:
 *         type:
 *           type: string
 *           enum: [read, quiz, assessment]
 *           description: Type of completion criteria
 *         passingScore:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Required passing score (for quiz/assessment)
 *         requiredTime:
 *           type: number
 *           minimum: 0
 *           description: Minimum time required in minutes (for read type)
 *
 *     CourseResource:
 *       type: object
 *       required:
 *         - title
 *         - url
 *         - type
 *       properties:
 *         title:
 *           type: string
 *           description: Resource title
 *         url:
 *           type: string
 *           format: uri
 *           description: Resource URL
 *         type:
 *           type: string
 *           enum: [pdf, video, link]
 *           description: Resource type
 *
 *     Course:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Course MongoDB ID
 *         courseId:
 *           type: string
 *           example: CRS000001
 *           description: Unique course identifier
 *         title:
 *           type: string
 *           description: Course title
 *         slug:
 *           type: string
 *           description: URL-friendly course slug
 *         description:
 *           type: string
 *           description: Course description
 *         content:
 *           type: string
 *           description: Course content (markdown/HTML)
 *         level:
 *           type: number
 *           enum: [1, 2, 3]
 *           description: Sustainability level (1=Foundation, 2=Efficiency, 3=Transformation)
 *         orderInLevel:
 *           type: number
 *           minimum: 1
 *           description: Order/sequence within the level
 *         duration:
 *           type: number
 *           description: Estimated duration in minutes
 *         thumbnail:
 *           type: string
 *           format: uri
 *           description: Course thumbnail URL
 *         completionCriteria:
 *           $ref: '#/components/schemas/CompletionCriteria'
 *         resources:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CourseResource'
 *         isActive:
 *           type: boolean
 *           description: Whether course is active
 *         createdBy:
 *           type: string
 *           description: ID of user who created the course
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     UserCourseProgress:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *           description: User ID
 *         course:
 *           type: object
 *           description: Populated course details
 *         organization:
 *           type: string
 *           description: Organization ID
 *         status:
 *           type: string
 *           enum: [not_started, in_progress, completed]
 *         startedAt:
 *           type: string
 *           format: date-time
 *         completedAt:
 *           type: string
 *           format: date-time
 *         timeSpent:
 *           type: number
 *           description: Total time spent in minutes
 *         quizScore:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         attempts:
 *           type: number
 *           description: Number of attempts
 *         lastAccessedAt:
 *           type: string
 *           format: date-time
 */

// ========================================
// ADMIN ROUTES - Course Management
// ========================================

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     description: Create a new learning course (Admin only)
 *     tags: [Courses (Admin)]
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
 *               - content
 *               - level
 *               - orderInLevel
 *               - duration
 *               - completionCriteria
 *             properties:
 *               title:
 *                 type: string
 *                 example: Introduction to Carbon Footprinting
 *               description:
 *                 type: string
 *                 example: Learn the basics of measuring your organization's carbon footprint
 *               content:
 *                 type: string
 *                 description: Full course content in markdown or HTML
 *               level:
 *                 type: number
 *                 enum: [1, 2, 3]
 *                 example: 1
 *               orderInLevel:
 *                 type: number
 *                 example: 1
 *               duration:
 *                 type: number
 *                 example: 45
 *                 description: Duration in minutes
 *               thumbnail:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/thumbnail.jpg
 *               completionCriteria:
 *                 $ref: '#/components/schemas/CompletionCriteria'
 *               resources:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/CourseResource'
 *     responses:
 *       201:
 *         description: Course created successfully
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
 *                   example: Course created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Course with same level and order already exists
 */
router.post(
  '/',
  authenticate,
  adminOnly,
  createCourseValidator,
  validate,
  CourseController.createCourse
);

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     description: Retrieve all active courses with optional filtering
 *     tags: [Courses (Admin)]
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
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
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
 *                     $ref: '#/components/schemas/Course'
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
router.get('/', authenticate, getCoursesValidator, validate, CourseController.getCourses);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     description: Retrieve a single course with full details
 *     tags: [Courses (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course MongoDB ID
 *     responses:
 *       200:
 *         description: Course retrieved successfully
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
 *                   $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 */
router.get('/:id', authenticate, getCourseByIdValidator, validate, CourseController.getCourseById);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update a course
 *     description: Update course details (Admin only)
 *     tags: [Courses (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course MongoDB ID
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
 *               content:
 *                 type: string
 *               level:
 *                 type: number
 *                 enum: [1, 2, 3]
 *               orderInLevel:
 *                 type: number
 *               duration:
 *                 type: number
 *               thumbnail:
 *                 type: string
 *               completionCriteria:
 *                 $ref: '#/components/schemas/CompletionCriteria'
 *               resources:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/CourseResource'
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       404:
 *         description: Course not found
 *       409:
 *         description: Conflict with existing course order
 */
router.put(
  '/:id',
  authenticate,
  adminOnly,
  updateCourseValidator,
  validate,
  CourseController.updateCourse
);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     description: Soft delete a course (Admin only)
 *     tags: [Courses (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course MongoDB ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 */
router.delete(
  '/:id',
  authenticate,
  adminOnly,
  deleteCourseValidator,
  validate,
  CourseController.deleteCourse
);

// ========================================
// USER ROUTES - Learning & Progress
// ========================================

/**
 * @swagger
 * /courses/{id}/start:
 *   post:
 *     summary: Start a course
 *     description: Begin or resume a course
 *     tags: [Learning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course MongoDB ID
 *     responses:
 *       200:
 *         description: Course started successfully
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
 *                   $ref: '#/components/schemas/UserCourseProgress'
 *       400:
 *         description: Course already completed
 *       403:
 *         description: Course not available for your current level
 *       404:
 *         description: Course not found
 */
router.post(
  '/:id/start',
  authenticate,
  startCourseValidator,
  validate,
  LearningController.startCourse
);

/**
 * @swagger
 * /courses/{id}/complete:
 *   post:
 *     summary: Complete a course
 *     description: Mark a course as completed (validates completion criteria)
 *     tags: [Learning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course MongoDB ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               timeSpent:
 *                 type: number
 *                 description: Time spent on course in minutes
 *                 example: 45
 *               quizScore:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Quiz score (required for quiz/assessment type courses)
 *                 example: 85
 *     responses:
 *       200:
 *         description: Course completed successfully
 *       400:
 *         description: Validation error or completion criteria not met
 *       404:
 *         description: Course not found
 */
router.post(
  '/:id/complete',
  authenticate,
  completeCourseValidator,
  validate,
  LearningController.completeCourse
);

export default router;
