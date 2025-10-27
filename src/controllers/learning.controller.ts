import { Response } from 'express';
import { AuthRequest } from '../types';
import {
  Course,
  UserCourseProgress,
  OrganizationLearningProgress,
  User,
  SustainabilityRoadmap,
  Organization,
} from '../models';
import { ApiResponseUtil } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  COURSE_STATUS,
  SUSTAINABILITY_LEVELS,
} from '../utils/constants';

export class LearningController {
  /**
   * Start a course
   * @route POST /api/v1/learning/courses/:id/start
   * @access Private
   */
  static startCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id: courseId } = req.params;
    const currentUser = req.user!;

    const course = await Course.findById(courseId);
    if (!course || !course.isActive) {
      return ApiResponseUtil.notFound(res, ERROR_MESSAGES.COURSE_NOT_FOUND);
    }

    // Check if user's organization level allows access to this course
    const organization = await Organization.findById(currentUser.organization);
    if (!organization) {
      return ApiResponseUtil.notFound(res, ERROR_MESSAGES.ORGANIZATION_NOT_FOUND);
    }

    if (course.level > organization.sustainabilityLevel) {
      return ApiResponseUtil.error(res, ERROR_MESSAGES.COURSE_NOT_AVAILABLE, 403);
    }

    // Check if user already has progress for this course
    let progress = await UserCourseProgress.findOne({
      user: currentUser.id,
      course: courseId,
    });

    if (progress) {
      if (progress.status === COURSE_STATUS.COMPLETED) {
        return ApiResponseUtil.error(res, ERROR_MESSAGES.COURSE_ALREADY_COMPLETED, 400);
      }
      // Update existing progress
      progress.status = COURSE_STATUS.IN_PROGRESS;
      if (!progress.startedAt) {
        progress.startedAt = new Date();
      }
      await progress.save();
    } else {
      // Create new progress
      progress = await UserCourseProgress.create({
        user: currentUser.id,
        course: courseId,
        organization: currentUser.organization,
        status: COURSE_STATUS.IN_PROGRESS,
        startedAt: new Date(),
      });
    }

    await progress.populate('course', 'title description duration level');

    return ApiResponseUtil.success(res, SUCCESS_MESSAGES.COURSE_STARTED, progress);
  });

  /**
   * Complete a course
   * @route POST /api/v1/learning/courses/:id/complete
   * @access Private
   */
  static completeCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id: courseId } = req.params;
    const { timeSpent, quizScore } = req.body;
    const currentUser = req.user!;

    const course = await Course.findById(courseId);
    if (!course || !course.isActive) {
      return ApiResponseUtil.notFound(res, ERROR_MESSAGES.COURSE_NOT_FOUND);
    }

    // Get user progress
    let progress = await UserCourseProgress.findOne({
      user: currentUser.id,
      course: courseId,
    });

    if (!progress) {
      return ApiResponseUtil.error(res, 'Please start the course first', 400);
    }

    if (progress.status === COURSE_STATUS.COMPLETED) {
      return ApiResponseUtil.error(res, ERROR_MESSAGES.COURSE_ALREADY_COMPLETED, 400);
    }

    // Validate completion criteria
    const { completionCriteria } = course;

    if (completionCriteria.type === 'quiz' || completionCriteria.type === 'assessment') {
      if (quizScore === undefined || quizScore === null) {
        return ApiResponseUtil.error(res, 'Quiz score is required for this course', 400);
      }

      if (completionCriteria.passingScore && quizScore < completionCriteria.passingScore) {
        // Update progress but don't mark as completed
        progress.quizScore = quizScore;
        progress.attempts += 1;
        await progress.save();

        return ApiResponseUtil.error(
          res,
          `Score ${quizScore}% is below passing score of ${completionCriteria.passingScore}%`,
          400
        );
      }

      progress.quizScore = quizScore;
    }

    if (completionCriteria.type === 'read' && completionCriteria.requiredTime) {
      const actualTimeSpent = timeSpent || progress.timeSpent;
      if (actualTimeSpent < completionCriteria.requiredTime) {
        return ApiResponseUtil.error(
          res,
          `Minimum required time is ${completionCriteria.requiredTime} minutes`,
          400
        );
      }
    }

    // Mark course as completed
    progress.status = COURSE_STATUS.COMPLETED;
    progress.completedAt = new Date();
    progress.attempts += 1;
    if (timeSpent) {
      progress.timeSpent += timeSpent;
    }
    await progress.save();

    // Update user's coursesCompleted count
    await User.findByIdAndUpdate(currentUser.id, {
      $inc: { coursesCompleted: 1 },
    });

    // Check if this completion triggers level advancement
    await LearningController.checkLevelAdvancement(currentUser.organization, course.level);

    await progress.populate('course', 'title description level');

    return ApiResponseUtil.success(res, SUCCESS_MESSAGES.COURSE_COMPLETED, progress);
  });

  /**
   * Get user's learning progress
   * @route GET /api/v1/learning/my-progress
   * @access Private
   */
  static getMyProgress = asyncHandler(async (req: AuthRequest, res: Response) => {
    const currentUser = req.user!;

    const organization = await Organization.findById(currentUser.organization);
    if (!organization) {
      return ApiResponseUtil.notFound(res, ERROR_MESSAGES.ORGANIZATION_NOT_FOUND);
    }

    const currentLevel = organization.sustainabilityLevel;

    // Get all courses for current level
    const coursesInLevel = await Course.find({
      level: currentLevel,
      isActive: true,
    }).sort({ orderInLevel: 1 });

    // Get user's progress for all courses
    const userProgress = await UserCourseProgress.find({
      user: currentUser.id,
    }).populate('course', 'title slug level orderInLevel duration thumbnail');

    // Calculate statistics
    const completedCourses = userProgress.filter((p) => p.status === COURSE_STATUS.COMPLETED);
    const inProgressCourses = userProgress.filter((p) => p.status === COURSE_STATUS.IN_PROGRESS);

    const totalCoursesInLevel = coursesInLevel.length;
    const completedInLevel = completedCourses.filter(
      (p: any) => p.course.level === currentLevel
    ).length;
    const progressPercentage =
      totalCoursesInLevel > 0 ? Math.round((completedInLevel / totalCoursesInLevel) * 100) : 0;

    return ApiResponseUtil.success(res, 'Learning progress retrieved successfully', {
      currentLevel,
      totalCoursesInLevel,
      completedInLevel,
      progressPercentage,
      coursesInProgress: inProgressCourses,
      completedCourses,
      availableCourses: coursesInLevel,
    });
  });

  /**
   * Get organization-wide learning progress
   * @route GET /api/v1/learning/organization-progress
   * @access Private
   */
  static getOrganizationProgress = asyncHandler(async (req: AuthRequest, res: Response) => {
    const currentUser = req.user!;

    let orgProgress = await OrganizationLearningProgress.findOne({
      organization: currentUser.organization,
    }).populate('organization', 'name sustainabilityLevel');

    if (!orgProgress) {
      // Initialize organization learning progress
      const organization = await Organization.findById(currentUser.organization);
      if (!organization) {
        return ApiResponseUtil.notFound(res, ERROR_MESSAGES.ORGANIZATION_NOT_FOUND);
      }

      const activeUsers = await User.countDocuments({
        organization: currentUser.organization,
        isActive: true,
      });

      const coursesLevel1 = await Course.countDocuments({ level: 1, isActive: true });

      orgProgress = await OrganizationLearningProgress.create({
        organization: currentUser.organization,
        currentLevel: organization.sustainabilityLevel,
        activeUsers,
        levelProgress: [
          {
            level: 1,
            totalCourses: coursesLevel1,
            completedByAllUsers: 0,
            progressPercentage: 0,
            unlockedAt: new Date(),
          },
        ],
      });

      await orgProgress.populate('organization', 'name sustainabilityLevel');
    }

    return ApiResponseUtil.success(
      res,
      'Organization learning progress retrieved successfully',
      orgProgress
    );
  });

  /**
   * Get leaderboard for organization
   * @route GET /api/v1/learning/leaderboard
   * @access Private
   */
  static getLeaderboard = asyncHandler(async (req: AuthRequest, res: Response) => {
    const currentUser = req.user!;

    const users = await User.find({
      organization: currentUser.organization,
      isActive: true,
    })
      .select('userId firstName lastName avatarUrl coursesCompleted learningLevel')
      .sort({ coursesCompleted: -1, learningLevel: -1 })
      .limit(20);

    return ApiResponseUtil.success(res, 'Leaderboard retrieved successfully', users);
  });

  /**
   * Helper function to check and perform level advancement
   */
  private static async checkLevelAdvancement(
    organizationId: string,
    completedCourseLevel: number
  ): Promise<void> {
    // Get all active users in organization
    const activeUsers = await User.find({
      organization: organizationId,
      isActive: true,
    });

    if (activeUsers.length === 0) return;

    // Get all courses for the completed level
    const coursesInLevel = await Course.find({
      level: completedCourseLevel,
      isActive: true,
    });

    if (coursesInLevel.length === 0) return;

    // Check if all users have completed all courses in this level
    const totalExpectedCompletions = activeUsers.length * coursesInLevel.length;
    const actualCompletions = await UserCourseProgress.countDocuments({
      organization: organizationId,
      course: { $in: coursesInLevel.map((c) => c._id) },
      status: COURSE_STATUS.COMPLETED,
    });

    // If all users completed all courses, advance to next level
    if (actualCompletions >= totalExpectedCompletions) {
      const organization = await Organization.findById(organizationId);
      const roadmap = await SustainabilityRoadmap.findOne({ organization: organizationId });

      if (organization && roadmap && completedCourseLevel < 3) {
        const nextLevel = (completedCourseLevel + 1) as 1 | 2 | 3;

        // Update organization level
        organization.sustainabilityLevel = nextLevel;
        await organization.save();

        // Update roadmap
        roadmap.currentLevel = nextLevel;
        if (nextLevel === 2) {
          (roadmap.levelUnlockedAt as any).level2 = new Date();
        } else if (nextLevel === 3) {
          (roadmap.levelUnlockedAt as any).level3 = new Date();
        }
        await roadmap.save();

        // Update organization learning progress
        let orgProgress = await OrganizationLearningProgress.findOne({
          organization: organizationId,
        });

        if (orgProgress) {
          orgProgress.currentLevel = nextLevel;

          // Mark previous level as completed
          const prevLevelProgress = orgProgress.levelProgress.find(
            (lp) => lp.level === completedCourseLevel
          );
          if (prevLevelProgress && !prevLevelProgress.completedAt) {
            prevLevelProgress.completedAt = new Date();
          }

          // Add new level progress
          const coursesInNextLevel = await Course.countDocuments({
            level: nextLevel,
            isActive: true,
          });

          const existingNextLevel = orgProgress.levelProgress.find((lp) => lp.level === nextLevel);
          if (!existingNextLevel) {
            orgProgress.levelProgress.push({
              level: nextLevel,
              totalCourses: coursesInNextLevel,
              completedByAllUsers: 0,
              progressPercentage: 0,
              unlockedAt: new Date(),
            });
          }

          await orgProgress.save();
        }

        // Update all users' learning level
        await User.updateMany(
          { organization: organizationId, isActive: true },
          { $set: { learningLevel: nextLevel } }
        );
      }
    }
  }
}
