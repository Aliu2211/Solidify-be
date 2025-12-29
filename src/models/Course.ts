import mongoose, { Schema } from 'mongoose';
import { ICourse } from '../types';
import { SUSTAINABILITY_LEVELS, COMPLETION_CRITERIA_TYPES, RESOURCE_TYPES } from '../utils/constants';

const courseSchema = new Schema<ICourse>(
  {
    courseId: {
      type: String,
      required: [true, 'Course ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    level: {
      type: Number,
      enum: Object.values(SUSTAINABILITY_LEVELS),
      required: [true, 'Level is required'],
    },
    orderInLevel: {
      type: Number,
      required: [true, 'Order in level is required'],
      min: [1, 'Order must be at least 1'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    thumbnail: {
      type: String,
      default: null,
    },
    completionCriteria: {
      type: {
        type: String,
        enum: Object.values(COMPLETION_CRITERIA_TYPES),
        required: true,
      },
      passingScore: {
        type: Number,
        min: [0, 'Passing score must be between 0 and 100'],
        max: [100, 'Passing score must be between 0 and 100'],
      },
      requiredTime: {
        type: Number,
        min: [0, 'Required time must be positive'],
      },
    },
    resources: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
        },
        type: {
          type: String,
          enum: Object.values(RESOURCE_TYPES),
          required: true,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        const { __v, ...rest } = ret;
        return rest;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Indexes for performance
courseSchema.index({ courseId: 1 });
courseSchema.index({ slug: 1 });
courseSchema.index({ level: 1, orderInLevel: 1 });
courseSchema.index({ isActive: 1 });

// Compound index to ensure unique orderInLevel per level
courseSchema.index({ level: 1, orderInLevel: 1 }, { unique: true });

// Generate slug from title before saving
courseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

const Course = mongoose.model<ICourse>('Course', courseSchema);

export default Course;
