import mongoose, { Schema } from 'mongoose';
import { ICarbonEntry } from '../types';
import { CARBON_ENTRY_TYPES, SUSTAINABILITY_LEVELS } from '../utils/constants';

const carbonEntrySchema = new Schema<ICarbonEntry>(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    sustainabilityLevel: {
      type: Number,
      enum: Object.values(SUSTAINABILITY_LEVELS),
      required: true,
    },
    entryDate: {
      type: Date,
      required: [true, 'Entry date is required'],
    },
    entryType: {
      type: String,
      enum: Object.values(CARBON_ENTRY_TYPES),
      required: [true, 'Entry type is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity must be positive'],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true,
    },
    emissionFactor: {
      type: Schema.Types.ObjectId,
      ref: 'EmissionFactor',
      required: true,
    },
    co2Equivalent: {
      type: Number,
      required: true,
      default: 0,
    },
    notes: {
      type: String,
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
carbonEntrySchema.index({ organization: 1, entryDate: -1 });
carbonEntrySchema.index({ sustainabilityLevel: 1 });
carbonEntrySchema.index({ entryType: 1 });

const CarbonEntry = mongoose.model<ICarbonEntry>('CarbonEntry', carbonEntrySchema);

export default CarbonEntry;
