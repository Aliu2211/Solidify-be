import { Response } from 'express';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponseUtil } from '../utils/response';
import Organization from '../models/Organization';
import User from '../models/User';
import Conversation from '../models/Conversation';
import { ERROR_MESSAGES } from '../utils/constants';

export class OrganizationController {
  /**
   * Get all organizations
   */
  static getAllOrganizations = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const organizations = await Organization.find({}).select('-__v');

    return ApiResponseUtil.success(res, 'Organizations retrieved successfully', organizations);
  });

  /**
   * Get single organization
   */
  static getOrganization = asyncHandler(async (req: AuthRequest, res: Response) => {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return ApiResponseUtil.notFound(res, 'Organization not found');
    }

    return ApiResponseUtil.success(res, 'Organization retrieved successfully', organization);
  });

  /**
   * Create new organization (Admin only)
   */
  static createOrganization = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, industryType, size, location, registrationNumber, description, website, logoUrl } = req.body;

    // Check if organization with same name or registration number exists
    const existingOrg = await Organization.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, 'i') } },
        { registrationNumber: registrationNumber.toUpperCase() }
      ]
    });

    if (existingOrg) {
      return ApiResponseUtil.badRequest(res, 'Organization with this name or registration number already exists');
    }

    const organization = await Organization.create({
      name,
      industryType,
      size,
      location,
      registrationNumber: registrationNumber.toUpperCase(),
      description,
      website,
      logoUrl
    });

    return ApiResponseUtil.created(res, 'Organization created successfully', organization);
  });

  /**
   * Update organization (Admin only)
   */
  static updateOrganization = asyncHandler(async (req: AuthRequest, res: Response) => {
    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!organization) {
      return ApiResponseUtil.notFound(res, 'Organization not found');
    }

    return ApiResponseUtil.success(res, 'Organization updated successfully', organization);
  });

  /**
   * Delete organization (Admin only)
   */
  static deleteOrganization = asyncHandler(async (req: AuthRequest, res: Response) => {
    const organization = await Organization.findByIdAndDelete(req.params.id);

    if (!organization) {
      return ApiResponseUtil.notFound(res, 'Organization not found');
    }

    return ApiResponseUtil.success(res, 'Organization deleted successfully');
  });

  /**
   * Get users from a specific organization
   */
  static getOrganizationUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    // Verify organization exists
    const organization = await Organization.findById(id);
    if (!organization) {
      return ApiResponseUtil.notFound(res, ERROR_MESSAGES.ORGANIZATION_NOT_FOUND);
    }

    // Find all active users belonging to this organization
    const users = await User.find({
      organization: id,
      isActive: true
    })
    .select('_id userId firstName lastName email role avatarUrl')
    .sort({ role: 1, firstName: 1 }); // Admins first, then alphabetically

    return ApiResponseUtil.success(
      res,
      'Organization users retrieved successfully',
      users
    );
  });

  /**
   * Connect with an organization (create conversation)
   */
  static connectWithOrganization = asyncHandler(async (req: AuthRequest, res: Response) => {
    const mongoose = require('mongoose');
    const { id: targetOrgId } = req.params;
    const { connectType = 'organization', userId } = req.body;
    const currentUser = req.user!;

    // Convert both IDs to strings for proper comparison
    const targetOrgIdStr = new mongoose.Types.ObjectId(targetOrgId).toString();
    const currentUserOrgStr = new mongoose.Types.ObjectId(currentUser.organization).toString();

    // Validate: Can't connect to own organization
    if (targetOrgIdStr === currentUserOrgStr) {
      return ApiResponseUtil.badRequest(res, 'Cannot connect to your own organization');
    }

    // Verify target organization exists
    const targetOrg = await Organization.findById(targetOrgId);
    if (!targetOrg) {
      return ApiResponseUtil.notFound(res, ERROR_MESSAGES.ORGANIZATION_NOT_FOUND);
    }

    if (connectType === 'user') {
      // User-to-User Chat
      if (!userId) {
        return ApiResponseUtil.badRequest(res, 'User ID is required for user-to-user chat');
      }

      // Verify target user exists and belongs to target organization
      const targetUser = await User.findOne({
        _id: userId,
        organization: targetOrgId,
        isActive: true
      });

      if (!targetUser) {
        return ApiResponseUtil.notFound(res, 'User not found in target organization');
      }

      // Check if direct conversation already exists between these two users
      const existingConversation = await Conversation.findOne({
        type: 'direct',
        'participants.user': { $all: [currentUser.id, targetUser._id] }
      }).populate('participants.user participants.organization');

      if (existingConversation) {
        return ApiResponseUtil.success(
          res,
          'Conversation already exists',
          existingConversation
        );
      }

      // Create new direct conversation
      const conversation = await Conversation.create({
        type: 'direct',
        organizations: [currentUser.organization, targetOrgId],
        participants: [
          {
            user: currentUser.id,
            organization: currentUser.organization,
            joinedAt: new Date(),
            isActive: true
          },
          {
            user: targetUser._id,
            organization: targetOrgId,
            joinedAt: new Date(),
            isActive: true
          }
        ],
        createdBy: currentUser.id
      });

      await conversation.populate('participants.user participants.organization');

      return ApiResponseUtil.created(
        res,
        'Direct conversation created successfully',
        conversation
      );

    } else {
      // Organization-to-Organization Chat (Group)

      // Check if group conversation already exists between these organizations
      const existingConversation = await Conversation.findOne({
        type: 'group',
        organizations: { $all: [currentUser.organization, targetOrgId], $size: 2 }
      }).populate('participants.user participants.organization');

      if (existingConversation) {
        return ApiResponseUtil.success(
          res,
          'Conversation already exists',
          existingConversation
        );
      }

      // Get current organization details
      const currentOrg = await Organization.findById(currentUser.organization);

      // Find admins/managers from both organizations
      const [currentOrgUsers, targetOrgUsers] = await Promise.all([
        User.find({
          organization: currentUser.organization,
          role: { $in: ['admin', 'manager'] },
          isActive: true
        }).limit(3),
        User.find({
          organization: targetOrgId,
          role: { $in: ['admin', 'manager'] },
          isActive: true
        }).limit(3)
      ]);

      // Make sure current user is included
      const allParticipants = new Set([currentUser.id]);
      currentOrgUsers.forEach(user => allParticipants.add(user._id.toString()));
      targetOrgUsers.forEach(user => allParticipants.add(user._id.toString()));

      // Create participants array
      const participants = Array.from(allParticipants).map(userId => {
        const user = [...currentOrgUsers, ...targetOrgUsers].find(
          u => u._id.toString() === userId
        );
        return {
          user: userId,
          organization: user?.organization || currentUser.organization,
          joinedAt: new Date(),
          isActive: true
        };
      });

      // Create new group conversation
      const conversation = await Conversation.create({
        type: 'group',
        name: `${currentOrg?.name} & ${targetOrg.name}`,
        organizations: [currentUser.organization, targetOrgId],
        participants,
        createdBy: currentUser.id
      });

      await conversation.populate('participants.user participants.organization');

      return ApiResponseUtil.created(
        res,
        'Group conversation created successfully',
        conversation
      );
    }
  });
}
