import mongoose, { Schema } from 'mongoose';
import { IKnowledgeArticle } from '../types';
import { CONTENT_STATUS, SUSTAINABILITY_LEVELS } from '../utils/constants';

const knowledgeArticleSchema = new Schema<IKnowledgeArticle>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      trim: true,
      maxlength: 500,
    },
    sustainabilityLevel: {
      type: Number,
      enum: Object.values(SUSTAINABILITY_LEVELS),
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(CONTENT_STATUS),
      default: CONTENT_STATUS.DRAFT,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
knowledgeArticleSchema.index({ slug: 1 });
knowledgeArticleSchema.index({ sustainabilityLevel: 1 });
knowledgeArticleSchema.index({ status: 1, publishedAt: -1 });
knowledgeArticleSchema.index({ title: 'text', summary: 'text', content: 'text' });

const KnowledgeArticle = mongoose.model<IKnowledgeArticle>('KnowledgeArticle', knowledgeArticleSchema);

export default KnowledgeArticle;
