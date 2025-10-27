import mongoose, { Schema } from 'mongoose';
import { IOrganizationLearningProgress } from '../types';
import { SUSTAINABILITY_LEVELS } from '../utils/constants';

const organizationLearningProgressSchema = new Schema<IOrganizationLearningProgress>(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization is required'],
      unique: true,
    },
    currentLevel: {
      type: Number,
      enum: Object.values(SUSTAINABILITY_LEVELS),
      default: SUSTAINABILITY_LEVELS.LEVEL_1,
    },
    levelProgress: [
      {
        level: {
          type: Number,
          enum: Object.values(SUSTAINABILITY_LEVELS),
          required: true,
        },
        totalCourses: {
          type: Number,
          required: true,
          min: [0, 'Total courses must be positive'],
        },
        completedByAllUsers: {
          type: Number,
          default: 0,
          min: [0, 'Completed courses must be positive'],
        },
        progressPercentage: {
          type: Number,
          default: 0,
          min: [0, 'Progress must be between 0 and 100'],
          max: [100, 'Progress must be between 0 and 100'],
        },
        unlockedAt: {
          type: Date,
          required: true,
        },
        completedAt: {
          type: Date,
          default: null,
        },
      },
    ],
    activeUsers: {
      type: Number,
      default: 0,
      min: [0, 'Active users must be positive'],
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
organizationLearningProgressSchema.index({ organization: 1 });
organizationLearningProgressSchema.index({ currentLevel: 1 });

// Calculate progress percentage before saving
organizationLearningProgressSchema.pre('save', function (next) {
  if (this.levelProgress && this.levelProgress.length > 0) {
    this.levelProgress.forEach((progress) => {
      if (progress.totalCourses > 0 && this.activeUsers > 0) {
        const totalExpectedCompletions = progress.totalCourses * this.activeUsers;
        progress.progressPercentage = Number(
          ((progress.completedByAllUsers / totalExpectedCompletions) * 100).toFixed(2)
        );
      }
    });
  }
  next();
});

const OrganizationLearningProgress = mongoose.model<IOrganizationLearningProgress>(
  'OrganizationLearningProgress',
  organizationLearningProgressSchema
);

export default OrganizationLearningProgress;
