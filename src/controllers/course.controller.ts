import { Response } from 'express';
import { AuthRequest } from '../types';
import { Course } from '../models';
import { ApiResponseUtil } from '../utils/response';
import { Helpers } from '../utils/helpers';
import slugify from 'slugify';
import { asyncHandler } from '../middleware/errorHandler';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, PAGINATION_DEFAULTS } from '../utils/constants';

export class CourseController {
  /**
   * Create a new course (Admin only)
   * @route POST /api/v1/courses
   * @access Private (Admin)
   */
  static createCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
    const {
      title,
      description,
      content,
      level,
      orderInLevel,
      duration,
      thumbnail,
      completionCriteria,
      resources,
    } = req.body;

    const currentUser = req.user!;

    // Check if course with same level and order already exists
    const existingCourse = await Course.findOne({ level, orderInLevel });
    if (existingCourse) {
      return ApiResponseUtil.error(
        res,
        `A course already exists at Level ${level}, Order ${orderInLevel}`,
        409
      );
    }

    // Generate collision-resistant courseId (avoid countDocuments which is not atomic)
    const courseId = Helpers.generateUserId('CRS');

    // Try to generate a unique slug and create the course. Retry on slug duplicate key errors.
    const MAX_SLUG_ATTEMPTS = 5;
    let course = null as any;
    let lastSlugTried = '';

    for (let attempt = 1; attempt <= MAX_SLUG_ATTEMPTS; attempt++) {
      const slug = Helpers.generateSlug(title);
      lastSlugTried = slug;
      try {
        course = await Course.create({
          courseId,
          title,
          slug,
          description,
          content,
          level,
          orderInLevel,
          duration,
          thumbnail,
          completionCriteria,
          resources: resources || [],
          createdBy: currentUser.id,
        });
        break; // success
      } catch (err: any) {
        // Duplicate key error on slug (robust detection)
        const isDuplicateSlug =
          err && (err.code === 11000 || (err.name === 'MongoError' && err.code === 11000)) &&
          (err.keyValue?.slug || err.keyPattern?.slug || (err.message && err.message.includes('slug')));

        if (isDuplicateSlug) {
          // Last attempt will fall through to deterministic fallback below
          if (attempt < MAX_SLUG_ATTEMPTS) continue;
          else break;
        }

        // Re-throw other errors
        throw err;
      }
    }

    // If we didn't get a course yet, attempt deterministic fallback using courseId to guarantee uniqueness
    if (!course) {
      // base slug (deterministic)
      const baseSlug = slugify(title, { lower: true, strict: true, trim: true });
      const deterministicSlug = `${baseSlug}-${courseId.toLowerCase()}`;

      try {
        course = await Course.create({
          courseId,
          title,
          slug: deterministicSlug,
          description,
          content,
          level,
          orderInLevel,
          duration,
          thumbnail,
          completionCriteria,
          resources: resources || [],
          createdBy: currentUser.id,
        });
      } catch (err: any) {
        // If even deterministic slug fails (very unlikely), try one last time with timestamp suffix
        const fallbackSlug = `${baseSlug}-${courseId.toLowerCase()}-${Date.now()}`;
        try {
          course = await Course.create({
            courseId,
            title,
            slug: fallbackSlug,
            description,
            content,
            level,
            orderInLevel,
            duration,
            thumbnail,
            completionCriteria,
            resources: resources || [],
            createdBy: currentUser.id,
          });
        } catch (finalErr) {
          // give a helpful error back to client
          return ApiResponseUtil.error(res, 'Could not generate a unique slug. Please try again', 500);
        }
      }
    }

    return ApiResponseUtil.created(res, SUCCESS_MESSAGES.COURSE_CREATED, course);
  });

  /**
   * Get all courses with optional filtering
   * @route GET /api/v1/courses
   * @access Private
   */
  static getCourses = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { level, page = PAGINATION_DEFAULTS.PAGE, limit = PAGINATION_DEFAULTS.LIMIT } = req.query;

    const query: any = { isActive: true };
    if (level) {
      query.level = Number(level);
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [courses, total] = await Promise.all([
      Course.find(query)
        .sort({ level: 1, orderInLevel: 1 })
        .skip(skip)
        .limit(limitNum)
        .select('-content') // Exclude full content from list
        .populate('createdBy', 'firstName lastName email'),
      Course.countDocuments(query),
    ]);

    return ApiResponseUtil.paginated(
      res,
      'Courses retrieved successfully',
      courses,
      pageNum,
      limitNum,
      total
    );
  });

  /**
   * Get single course by ID
   * @route GET /api/v1/courses/:id
   * @access Private
   */
  static getCourseById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const course = await Course.findById(id).populate('createdBy', 'firstName lastName email');

    if (!course) {
      return ApiResponseUtil.notFound(res, ERROR_MESSAGES.COURSE_NOT_FOUND);
    }

    return ApiResponseUtil.success(res, 'Course retrieved successfully', course);
  });

  /**
   * Update a course (Admin only)
   * @route PUT /api/v1/courses/:id
   * @access Private (Admin)
   */
  static updateCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return ApiResponseUtil.notFound(res, ERROR_MESSAGES.COURSE_NOT_FOUND);
    }

    // If changing level or orderInLevel, check for conflicts
    if (
      (updateData.level && updateData.level !== course.level) ||
      (updateData.orderInLevel && updateData.orderInLevel !== course.orderInLevel)
    ) {
      const conflictingCourse = await Course.findOne({
        _id: { $ne: id },
        level: updateData.level || course.level,
        orderInLevel: updateData.orderInLevel || course.orderInLevel,
      });

      if (conflictingCourse) {
        return ApiResponseUtil.error(
          res,
          `A course already exists at Level ${updateData.level || course.level}, Order ${
            updateData.orderInLevel || course.orderInLevel
          }`,
          409
        );
      }
    }

    Object.assign(course, updateData);
    await course.save();

    return ApiResponseUtil.success(res, SUCCESS_MESSAGES.COURSE_UPDATED, course);
  });

  /**
   * Delete a course (Admin only)
   * @route DELETE /api/v1/courses/:id
   * @access Private (Admin)
   */
  static deleteCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return ApiResponseUtil.notFound(res, ERROR_MESSAGES.COURSE_NOT_FOUND);
    }

    // Soft delete by setting isActive to false
    course.isActive = false;
    await course.save();

    return ApiResponseUtil.success(res, SUCCESS_MESSAGES.COURSE_DELETED, null);
  });
}
