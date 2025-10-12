import mongoose, { Schema } from 'mongoose';
import { IConversation } from '../types';
import { CONVERSATION_TYPES } from '../utils/constants';
import { Helpers } from '../utils/helpers';

const conversationSchema = new Schema<IConversation>(
  {
    conversationId: {
      type: String,
      unique: true,
    },
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
    organizations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
      },
    ],
    participants: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        organization: {
          type: Schema.Types.ObjectId,
          ref: 'Organization',
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate conversationId before saving
conversationSchema.pre('save', async function (next) {
  if (!this.conversationId) {
    const count = await mongoose.model('Conversation').countDocuments();
    this.conversationId = `CONV${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Indexes
conversationSchema.index({ conversationId: 1 });
conversationSchema.index({ 'participants.user': 1 });
conversationSchema.index({ 'participants.organization': 1 });
conversationSchema.index({ organizations: 1 });
conversationSchema.index({ type: 1 });
conversationSchema.index({ isActive: 1 });

const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation;
