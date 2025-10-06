import { Server, Socket } from 'socket.io';
import { JWTService } from '../services/jwt.service';
import { Message, Conversation } from '../models';
import { SOCKET_EVENTS } from '../utils/constants';
import logger from '../utils/logger';

export const setupChatSocket = (io: Server) => {
  // Store online users
  const onlineUsers = new Map<string, string>(); // userId -> socketId

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const payload = JWTService.verifyAccessToken(token);

      if (!payload) {
        return next(new Error('Invalid token'));
      }

      socket.data.user = payload;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.user.id;
    logger.info(`User connected: ${userId}`);

    // Store user socket
    onlineUsers.set(userId, socket.id);

    // Notify others user is online
    socket.broadcast.emit(SOCKET_EVENTS.USER_ONLINE, { userId });

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Join room
    socket.on(SOCKET_EVENTS.JOIN_ROOM, (data: { conversationId: string }) => {
      socket.join(`conversation:${data.conversationId}`);
      logger.info(`User ${userId} joined conversation ${data.conversationId}`);
    });

    // Leave room
    socket.on(SOCKET_EVENTS.LEAVE_ROOM, (data: { conversationId: string }) => {
      socket.leave(`conversation:${data.conversationId}`);
    });

    // Send message
    socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data) => {
      try {
        const { conversationId, content, messageType, fileUrl, fileName } = data;

        // Create message
        const message = await Message.create({
          conversation: conversationId,
          sender: userId,
          messageType: messageType || 'text',
          content,
          fileUrl,
          fileName,
        });

        await message.populate('sender', 'firstName lastName avatarUrl');

        // Update conversation last message
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: {
            content,
            sender: userId,
            timestamp: new Date(),
          },
          updatedAt: new Date(),
        });

        // Emit to conversation room
        io.to(`conversation:${conversationId}`).emit(SOCKET_EVENTS.NEW_MESSAGE, message);

        // Send delivery confirmation
        socket.emit(SOCKET_EVENTS.MESSAGE_DELIVERED, { messageId: message._id });
      } catch (error: any) {
        logger.error('Send message error:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: error.message });
      }
    });

    // Typing start
    socket.on(SOCKET_EVENTS.TYPING_START, (data: { conversationId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit(SOCKET_EVENTS.USER_TYPING, {
        userId,
        userName: socket.data.user.firstName,
        isTyping: true,
      });
    });

    // Typing stop
    socket.on(SOCKET_EVENTS.TYPING_STOP, (data: { conversationId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit(SOCKET_EVENTS.USER_TYPING, {
        userId,
        userName: socket.data.user.firstName,
        isTyping: false,
      });
    });

    // Message read
    socket.on(SOCKET_EVENTS.MESSAGE_READ, async (data: { messageId: string, conversationId: string }) => {
      try {
        await Message.findByIdAndUpdate(data.messageId, {
          $addToSet: { readBy: userId },
        });

        socket.to(`conversation:${data.conversationId}`).emit(SOCKET_EVENTS.MESSAGE_READ, {
          messageId: data.messageId,
          userId,
        });
      } catch (error: any) {
        logger.error('Message read error:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      socket.broadcast.emit(SOCKET_EVENTS.USER_OFFLINE, { userId });
      logger.info(`User disconnected: ${userId}`);
    });
  });
};
