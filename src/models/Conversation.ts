import mongoose, { Schema } from 'mongoose';
import { IConversation } from '../types';
import { CONVERSATION_TYPES } from '../utils/constants';

const conversationSchema = new Schema<IConversation>(
  {
    type: {
      type: String,
      enum: Object.values(CONVERSATION_TYPES),
      required: true,
    },
    name: {
      type: String,
      trim: true,
      default: null,
    },
    participants: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        lastReadAt: {
          type: Date,
          default: null,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastMessage: {
      content: String,
      sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      timestamp: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
conversationSchema.index({ 'participants.user': 1 });
conversationSchema.index({ type: 1 });

const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation;
