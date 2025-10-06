import mongoose, { Schema } from 'mongoose';
import { INewsArticle } from '../types';
import { CONTENT_STATUS, NEWS_CATEGORIES } from '../utils/constants';

const newsArticleSchema = new Schema<INewsArticle>(
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
    imageUrl: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      enum: Object.values(NEWS_CATEGORIES),
      required: true,
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
    source: {
      type: String,
      default: null,
    },
    sourceUrl: {
      type: String,
      default: null,
    },
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
newsArticleSchema.index({ slug: 1 });
newsArticleSchema.index({ category: 1 });
newsArticleSchema.index({ status: 1, publishedAt: -1 });
newsArticleSchema.index({ title: 'text', summary: 'text', content: 'text' });

const NewsArticle = mongoose.model<INewsArticle>('NewsArticle', newsArticleSchema);

export default NewsArticle;
