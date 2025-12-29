import mongoose, { Document, Schema } from 'mongoose';

export interface ILibraryResource extends Document {
  resourceId: string;
  title: string;
  description: string;
  category: 'template' | 'regulatory' | 'case-study' | 'guide' | 'report' | 'video' | 'webinar';
  tags: string[];
  fileType: 'pdf' | 'xlsx' | 'docx' | 'pptx' | 'video' | 'link';
  fileUrl: string;
  fileSize?: number;
  thumbnailUrl?: string;
  level?: number;
  industry?: string[];
  uploadedBy: mongoose.Types.ObjectId;
  downloadCount: number;
  viewCount: number;
  isFeatured: boolean;
  isPremium: boolean;
  version?: string;
  publishedDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const libraryResourceSchema = new Schema<ILibraryResource>(
  {
    resourceId: {
      type: String,
      required: true,
      unique: true,
      match: /^LIB\d{6}$/,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      enum: ['template', 'regulatory', 'case-study', 'guide', 'report', 'video', 'webinar'],
      required: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.length <= 20;
        },
        message: 'Cannot have more than 20 tags',
      },
    },
    fileType: {
      type: String,
      enum: ['pdf', 'xlsx', 'docx', 'pptx', 'video', 'link'],
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    fileSize: {
      type: Number,
      min: 0,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
    },
    level: {
      type: Number,
      enum: [1, 2, 3],
    },
    industry: {
      type: [String],
      default: [],
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    version: {
      type: String,
      trim: true,
    },
    publishedDate: {
      type: Date,
      default: Date.now,
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

// Indexes for efficient querying
libraryResourceSchema.index({ category: 1 });
libraryResourceSchema.index({ tags: 1 });
libraryResourceSchema.index({ level: 1 });
libraryResourceSchema.index({ isFeatured: 1 });
libraryResourceSchema.index({ publishedDate: -1 });
libraryResourceSchema.index({ downloadCount: -1 });
libraryResourceSchema.index({ viewCount: -1 });

// Auto-generate resourceId if not provided
libraryResourceSchema.pre('save', async function (next) {
  if (!this.resourceId) {
    const count = await mongoose.model('LibraryResource').countDocuments();
    this.resourceId = `LIB${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

export const LibraryResource = mongoose.model<ILibraryResource>(
  'LibraryResource',
  libraryResourceSchema
);
