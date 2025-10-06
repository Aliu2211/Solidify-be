import mongoose, { Schema } from 'mongoose';
import { IOrganization } from '../types';
import { ORGANIZATION_SIZES, SUSTAINABILITY_LEVELS } from '../utils/constants';

const organizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    industryType: {
      type: String,
      required: [true, 'Industry type is required'],
      trim: true,
    },
    size: {
      type: String,
      enum: Object.values(ORGANIZATION_SIZES),
      required: [true, 'Organization size is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    description: {
      type: String,
      default: null,
    },
    logoUrl: {
      type: String,
      default: null,
    },
    website: {
      type: String,
      default: null,
    },
    sustainabilityLevel: {
      type: Number,
      enum: Object.values(SUSTAINABILITY_LEVELS),
      default: SUSTAINABILITY_LEVELS.LEVEL_1,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
organizationSchema.index({ registrationNumber: 1 });
organizationSchema.index({ name: 'text' });

const Organization = mongoose.model<IOrganization>('Organization', organizationSchema);

export default Organization;
