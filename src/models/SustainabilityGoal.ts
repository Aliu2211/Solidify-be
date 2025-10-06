import mongoose, { Schema } from 'mongoose';
import { ISustainabilityGoal } from '../types';
import { SUSTAINABILITY_LEVELS, GOAL_STATUS } from '../utils/constants';

const sustainabilityGoalSchema = new Schema<ISustainabilityGoal>(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    level: {
      type: Number,
      enum: Object.values(SUSTAINABILITY_LEVELS),
      required: true,
    },
    targetYear: {
      type: Number,
      required: [true, 'Target year is required'],
      min: [2024, 'Target year must be 2024 or later'],
    },
    targetReductionPercentage: {
      type: Number,
      required: [true, 'Target reduction percentage is required'],
      min: [0, 'Percentage must be between 0 and 100'],
      max: [100, 'Percentage must be between 0 and 100'],
    },
    baselineEmissions: {
      type: Number,
      default: null,
      min: [0, 'Baseline emissions must be positive'],
    },
    currentEmissions: {
      type: Number,
      default: null,
      min: [0, 'Current emissions must be positive'],
    },
    status: {
      type: String,
      enum: Object.values(GOAL_STATUS),
      default: GOAL_STATUS.IN_PROGRESS,
    },
    description: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
sustainabilityGoalSchema.index({ organization: 1, level: 1 });
sustainabilityGoalSchema.index({ status: 1 });

const SustainabilityGoal = mongoose.model<ISustainabilityGoal>(
  'SustainabilityGoal',
  sustainabilityGoalSchema
);

export default SustainabilityGoal;
