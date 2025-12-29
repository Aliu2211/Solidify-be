import mongoose, { Schema } from 'mongoose';
import { IUserCourseProgress } from '../types';
import { COURSE_STATUS } from '../utils/constants';

const userCourseProgressSchema = new Schema<IUserCourseProgress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization is required'],
    },
    status: {
      type: String,
      enum: Object.values(COURSE_STATUS),
      default: COURSE_STATUS.NOT_STARTED,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    timeSpent: {
      type: Number,
      default: 0,
      min: [0, 'Time spent must be positive'],
    },
    quizScore: {
      type: Number,
      default: null,
      min: [0, 'Score must be between 0 and 100'],
      max: [100, 'Score must be between 0 and 100'],
    },
    attempts: {
      type: Number,
      default: 0,
      min: [0, 'Attempts must be positive'],
    },
    lastAccessedAt: {
      type: Date,
      default: null,
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
userCourseProgressSchema.index({ user: 1, course: 1 }, { unique: true });
userCourseProgressSchema.index({ organization: 1 });
userCourseProgressSchema.index({ status: 1 });
userCourseProgressSchema.index({ user: 1, status: 1 });

// Update lastAccessedAt on every save
userCourseProgressSchema.pre('save', function (next) {
  this.lastAccessedAt = new Date();
  next();
});

const UserCourseProgress = mongoose.model<IUserCourseProgress>(
  'UserCourseProgress',
  userCourseProgressSchema
);

export default UserCourseProgress;
