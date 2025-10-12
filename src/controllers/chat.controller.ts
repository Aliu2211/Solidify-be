import { Response } from 'express';
import { AuthRequest } from '../types';
import { Conversation, Message, User } from '../models';
import { ApiResponseUtil } from '../utils/response';
import { Helpers } from '../utils/helpers';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';
import { asyncHandler } from '../middleware/errorHandler';

export class ChatController {
  /**
   * Get all conversations for user's organization
   */
  static getConversations = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const userOrgId = req.user!.organization;
    const { type, page = 1, limit = 20 } = req.query;

    const query: any = {
      'participants.user': userId,
      'participants.isActive': true,
      isActive: true,
    };

    if (type) {
      query.type = type;
    }

    const { skip, limit: limitNum } = Helpers.getPagination(Number(page), Number(limit));

    const [conversations, total] = await Promise.all([
      Conversation.find(query)
        .populate('participants.user', 'userId firstName lastName avatarUrl')
        .populate('participants.organization', 'orgId name logoUrl')
        .populate('createdBy', 'firstName lastName')
        .populate('lastMessage.sender', 'firstName lastName')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Conversation.countDocuments(query),
    ]);

    return ApiResponseUtil.paginated(
      res,
      'Conversations retrieved successfully',
      conversations,
      Number(page),
      limitNum,
      total
    );
  });

  /**
   * Create new conversation (inter-organizational messaging)
   */
  static createConversation = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { participantUserIds, participantOrgIds, type, name } = req.body;
    const userId = req.user!.id;
    const userOrgId = req.user!.organization;

    // Validate all participant users exist
    const users = await User.find({ _id: { $in: participantUserIds }, isActive: true });
    if (users.length !== participantUserIds.length) {
      return ApiResponseUtil.badRequest(res, 'One or more participant users not found');
    }

    // Build participants array with user-org pairs
    const participants = [
      {
        user: userId,
        organization: userOrgId,
        joinedAt: new Date(),
        isActive: true,
      },
      ...participantUserIds.map((uid: string, index: number) => ({
        user: uid,
        organization: participantOrgIds[index],
        joinedAt: new Date(),
        isActive: true,
      })),
    ];

    // Get unique organization IDs
    const organizations = Array.from(new Set([userOrgId.toString(), ...participantOrgIds]));

    // Check for existing direct conversation between same participants
    if (type === 'direct' && participantUserIds.length === 1) {
      const existingConversation = await Conversation.findOne({
        type: 'direct',
        'participants.user': { $all: [userId, participantUserIds[0]] },
        isActive: true,
      });

      if (existingConversation) {
        await existingConversation.populate('participants.user', 'userId firstName lastName avatarUrl');
        await existingConversation.populate('participants.organization', 'orgId name logoUrl');
        return ApiResponseUtil.success(
          res,
          'Conversation already exists',
          existingConversation
        );
      }
    }

    const conversation = await Conversation.create({
      type,
      name,
      participants,
      organizations,
      createdBy: userId,
      isActive: true,
    });

    await conversation.populate('participants.user', 'userId firstName lastName avatarUrl');
    await conversation.populate('participants.organization', 'orgId name logoUrl');

    return ApiResponseUtil.created(res, SUCCESS_MESSAGES.CONVERSATION_CREATED, conversation);
  });

  /**
   * Get messages in conversation
   */
  static getMessages = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user!.id;

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return ApiResponseUtil.notFound(res, ERROR_MESSAGES.CONVERSATION_NOT_FOUND);
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some(
      p => p.user.toString() === userId && p.isActive
    );

    if (!isParticipant) {
      return ApiResponseUtil.forbidden(res, ERROR_MESSAGES.NOT_PARTICIPANT);
    }

    const { skip, limit: limitNum } = Helpers.getPagination(Number(page), Number(limit));

    const [messages, total] = await Promise.all([
      Message.find({ conversation: id, isDeleted: false })
        .populate('sender', 'userId firstName lastName avatarUrl')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Message.countDocuments({ conversation: id, isDeleted: false }),
    ]);

    return ApiResponseUtil.paginated(
      res,
      'Messages retrieved successfully',
      messages.reverse(),
      Number(page),
      limitNum,
      total
    );
  });

  /**
   * Send message (REST endpoint, Socket.io also handles this)
   */
  static sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { conversationId, content, messageType, fileUrl, fileName } = req.body;
    const userId = req.user!.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return ApiResponseUtil.notFound(res, ERROR_MESSAGES.CONVERSATION_NOT_FOUND);
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some(
      p => p.user.toString() === userId && p.isActive
    );

    if (!isParticipant) {
      return ApiResponseUtil.forbidden(res, ERROR_MESSAGES.NOT_PARTICIPANT);
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: userId,
      messageType: messageType || 'text',
      content,
      fileUrl,
      fileName,
    });

    // Update conversation last message
    conversation.lastMessage = {
      content,
      sender: userId as any,
      timestamp: new Date(),
    };
    await conversation.save();

    await message.populate('sender', 'userId firstName lastName avatarUrl');

    return ApiResponseUtil.created(res, SUCCESS_MESSAGES.MESSAGE_SENT, message);
  });

  /**
   * Mark conversation messages as read
   */
  static markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return ApiResponseUtil.notFound(res, ERROR_MESSAGES.CONVERSATION_NOT_FOUND);
    }

    // Check if user is participant
    const participant = conversation.participants.find(
      p => p.user.toString() === userId && p.isActive
    );

    if (!participant) {
      return ApiResponseUtil.forbidden(res, ERROR_MESSAGES.NOT_PARTICIPANT);
    }

    // Update lastReadAt for this participant
    participant.lastReadAt = new Date();
    await conversation.save();

    return ApiResponseUtil.success(res, 'Messages marked as read', { lastReadAt: participant.lastReadAt });
  });
}
