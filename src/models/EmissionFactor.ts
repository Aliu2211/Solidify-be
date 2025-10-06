import mongoose, { Schema } from 'mongoose';
import { IEmissionFactor } from '../types';
import { SUSTAINABILITY_LEVELS } from '../utils/constants';

const emissionFactorSchema = new Schema<IEmissionFactor>(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    subCategory: {
      type: String,
      trim: true,
      default: null,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    factorValue: {
      type: Number,
      required: [true, 'Factor value is required'],
      min: [0, 'Factor value must be positive'],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true,
    },
    source: {
      type: String,
      required: [true, 'Source is required'],
      trim: true,
    },
    region: {
      type: String,
      default: 'Ghana',
      trim: true,
    },
    sustainabilityLevel: {
      type: Number,
      enum: Object.values(SUSTAINABILITY_LEVELS),
      required: true,
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

// Indexes
emissionFactorSchema.index({ category: 1, sustainabilityLevel: 1 });
emissionFactorSchema.index({ isActive: 1 });

const EmissionFactor = mongoose.model<IEmissionFactor>('EmissionFactor', emissionFactorSchema);

export default EmissionFactor;
