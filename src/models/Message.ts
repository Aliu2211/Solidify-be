import mongoose, { Schema } from 'mongoose';
import { IMessage } from '../types';
import { MESSAGE_TYPES } from '../utils/constants';

const messageSchema = new Schema<IMessage>(
  {
    messageId: {
      type: String,
      unique: true,
    },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messageType: {
      type: String,
      enum: Object.values(MESSAGE_TYPES),
      default: MESSAGE_TYPES.TEXT,
    },
    content: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      default: null,
    },
    fileName: {
      type: String,
      default: null,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Generate messageId before saving
messageSchema.pre('save', async function (next) {
  if (!this.messageId) {
    const count = await mongoose.model('Message').countDocuments();
    this.messageId = `MSG${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Indexes
messageSchema.index({ messageId: 1 });
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
