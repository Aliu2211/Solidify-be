import { Response } from 'express';
import { AuthRequest } from '../types';
import { User, Organization } from '../models';
import { JWTService } from '../services/jwt.service';
import { EmailService } from '../services/email.service';
import { ApiResponseUtil } from '../utils/response';
import { Helpers } from '../utils/helpers';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';
import { asyncHandler } from '../middleware/errorHandler';

export class AuthController {
  /**
   * Register new user
   */
  static register = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password, firstName, lastName, organizationId } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ApiResponseUtil.conflict(res, ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    // Verify organization exists
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return ApiResponseUtil.notFound(res, ERROR_MESSAGES.ORGANIZATION_NOT_FOUND);
    }

    // Generate unique user ID
    const userId = Helpers.generateUserId('SME');

    // Create user
    const user = await User.create({
      userId,
      email,
      password,
      firstName,
      lastName,
      organization: organizationId,
    });

    // Generate tokens
    const payload = {
      id: user._id.toString(),
      userId: user.userId,
      email: user.email,
      role: user.role,
      organization: user.organization.toString(),
    };
    const tokens = JWTService.generateTokens(payload);

    // Send welcome email (don't wait for it)
    EmailService.sendWelcomeEmail(email, firstName, userId).catch(err =>
      console.error('Welcome email failed:', err)
    );

    return ApiResponseUtil.created(res, SUCCESS_MESSAGES.REGISTRATION_SUCCESS, {
      user: Helpers.sanitizeUser(user),
      ...tokens,
    });
  });

  /**
   * Login user
   */
  static login = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { identifier, password } = req.body;

    // Find user by email or userId
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { userId: identifier.toUpperCase() }
      ]
    }).select('+password').populate('organization');

    if (!user) {
      return ApiResponseUtil.unauthorized(res, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return ApiResponseUtil.unauthorized(res, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const payload = {
      id: user._id.toString(),
      userId: user.userId,
      email: user.email,
      role: user.role,
      organization: user.organization._id.toString(),
    };
    const tokens = JWTService.generateTokens(payload);

    return ApiResponseUtil.success(res, SUCCESS_MESSAGES.LOGIN_SUCCESS, {
      user: Helpers.sanitizeUser(user),
      ...tokens,
    });
  });

  /**
   * Refresh access token
   */
  static refreshToken = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return ApiResponseUtil.badRequest(res, 'Refresh token is required');
    }

    const payload = JWTService.verifyRefreshToken(refreshToken);
    if (!payload) {
      return ApiResponseUtil.unauthorized(res, ERROR_MESSAGES.INVALID_TOKEN);
    }

    // Generate new tokens
    const tokens = JWTService.generateTokens(payload);

    return ApiResponseUtil.success(res, 'Token refreshed successfully', tokens);
  });

  /**
   * Change password
   */
  static changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.id;

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return ApiResponseUtil.notFound(res, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Verify current password
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return ApiResponseUtil.unauthorized(res, 'Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return ApiResponseUtil.success(res, SUCCESS_MESSAGES.PASSWORD_CHANGED);
  });

  /**
   * Get current user
   */
  static getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user!.id).populate('organization');

    if (!user) {
      return ApiResponseUtil.notFound(res, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return ApiResponseUtil.success(res, 'User retrieved successfully', Helpers.sanitizeUser(user));
  });
}
