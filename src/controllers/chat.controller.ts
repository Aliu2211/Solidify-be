import { Response } from 'express';
import { AuthRequest } from '../types';
import { Conversation, Message } from '../models';
import { ApiResponseUtil } from '../utils/response';
import { Helpers } from '../utils/helpers';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';
import { asyncHandler } from '../middleware/errorHandler';

export class ChatController {
  /**
   * Get all conversations for user
   */
  static getConversations = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const conversations = await Conversation.find({
      'participants.user': userId,
      'participants.isActive': true,
    })
      .populate('participants.user', 'firstName lastName avatarUrl')
      .populate('createdBy', 'firstName lastName')
      .populate('lastMessage.sender', 'firstName lastName')
      .sort({ updatedAt: -1 });

    return ApiResponseUtil.success(res, 'Conversations retrieved successfully', conversations);
  });

  /**
   * Create new conversation
   */
  static createConversation = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { participantIds, type, name } = req.body;
    const userId = req.user!.id;

    const participants = [userId, ...participantIds].map(id => ({
      user: id,
      joinedAt: new Date(),
      isActive: true,
    }));

    const conversation = await Conversation.create({
      type,
      name,
      participants,
      createdBy: userId,
    });

    await conversation.populate('participants.user', 'firstName lastName avatarUrl');

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
        .populate('sender', 'firstName lastName avatarUrl')
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

    await message.populate('sender', 'firstName lastName avatarUrl');

    return ApiResponseUtil.created(res, SUCCESS_MESSAGES.MESSAGE_SENT, message);
  });
}
