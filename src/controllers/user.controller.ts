import { Response } from 'express';
import { AuthRequest } from '../types';
import { User } from '../models';
import { ApiResponseUtil } from '../utils/response';
import { ERROR_MESSAGES } from '../utils/constants';
import { asyncHandler } from '../middleware/errorHandler';
import { Helpers } from '../utils/helpers';

export class UserController {
  /**
   * Get all users (Admin only)
   */
  static getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 50, role, organization, search } = req.query;

    const query: any = {};

    // Filter by role
    if (role) {
      query.role = role;
    }

    // Filter by organization
    if (organization) {
      query.organization = organization;
    }

    // Search by name or email
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { userId: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query)
        .populate('organization', 'name industryType size')
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(query)
    ]);

    return ApiResponseUtil.success(res, 'Users retrieved successfully', {
      users: users.map(user => Helpers.sanitizeUser(user)),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  });

  /**
   * Get user by ID (Admin only)
   */
  static getUserById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const user = await User.findById(id)
      .populate('organization')
      .select('-password');

    if (!user) {
      return ApiResponseUtil.notFound(res, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return ApiResponseUtil.success(res, 'User retrieved successfully', Helpers.sanitizeUser(user));
  });

  /**
   * Update user (Admin only)
   */
  static updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { firstName, lastName, email, role, isActive, learningLevel } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return ApiResponseUtil.notFound(res, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return ApiResponseUtil.conflict(res, ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      }
      user.email = email.toLowerCase();
    }

    // Update fields if provided
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (role !== undefined) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (learningLevel !== undefined) user.learningLevel = learningLevel;

    await user.save();

    const updatedUser = await User.findById(id)
      .populate('organization')
      .select('-password');

    return ApiResponseUtil.success(res, 'User updated successfully', Helpers.sanitizeUser(updatedUser));
  });

  /**
   * Delete user (Admin only)
   */
  static deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return ApiResponseUtil.notFound(res, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user!.id) {
      return ApiResponseUtil.badRequest(res, 'You cannot delete your own account');
    }

    await User.findByIdAndDelete(id);

    return ApiResponseUtil.success(res, 'User deleted successfully');
  });

  /**
   * Get user statistics (Admin only)
   */
  static getUserStats = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const [totalUsers, activeUsers, usersByRole, usersByLevel] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]),
      User.aggregate([
        {
          $group: {
            _id: '$learningLevel',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    return ApiResponseUtil.success(res, 'User statistics retrieved successfully', {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      usersByRole,
      usersByLevel
    });
  });
}
