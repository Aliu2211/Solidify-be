import mongoose, { Document, Schema } from 'mongoose';

export interface IUserFavorite extends Document {
  user: mongoose.Types.ObjectId;
  resource: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  createdAt: Date;
}

const userFavoriteSchema = new Schema<IUserFavorite>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resource: {
      type: Schema.Types.ObjectId,
      ref: 'LibraryResource',
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only favorite a resource once
userFavoriteSchema.index({ user: 1, resource: 1 }, { unique: true });
userFavoriteSchema.index({ organization: 1 });

export const UserFavorite = mongoose.model<IUserFavorite>('UserFavorite', userFavoriteSchema);
