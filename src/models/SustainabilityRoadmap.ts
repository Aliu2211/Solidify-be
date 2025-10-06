import mongoose, { Schema } from 'mongoose';
import { ISustainabilityRoadmap } from '../types';
import { SUSTAINABILITY_LEVELS } from '../utils/constants';

const sustainabilityRoadmapSchema = new Schema<ISustainabilityRoadmap>(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      unique: true,
    },
    currentLevel: {
      type: Number,
      enum: Object.values(SUSTAINABILITY_LEVELS),
      default: SUSTAINABILITY_LEVELS.LEVEL_1,
    },
    milestones: [
      {
        number: {
          type: Number,
          required: true,
          min: 1,
          max: 6,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          default: null,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        completedAt: {
          type: Date,
          default: null,
        },
      },
    ],
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
sustainabilityRoadmapSchema.index({ organization: 1 });

// Calculate progress percentage before saving
sustainabilityRoadmapSchema.pre('save', function (next) {
  if (this.milestones && this.milestones.length > 0) {
    const completedCount = this.milestones.filter(m => m.completed).length;
    this.progressPercentage = Number(((completedCount / this.milestones.length) * 100).toFixed(2));
  }
  next();
});

const SustainabilityRoadmap = mongoose.model<ISustainabilityRoadmap>(
  'SustainabilityRoadmap',
  sustainabilityRoadmapSchema
);

export default SustainabilityRoadmap;
