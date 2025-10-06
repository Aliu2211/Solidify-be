import { Request } from 'express';
import { Document, Types } from 'mongoose';

// ========================================
// USER & ORGANIZATION TYPES
// ========================================

export interface IUser extends Document {
  _id: Types.ObjectId;
  userId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'user';
  organization: Types.ObjectId;
  avatarUrl?: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IOrganization extends Document {
  _id: Types.ObjectId;
  name: string;
  registrationNumber: string;
  industryType: string;
  size: 'small' | 'medium';
  location: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  sustainabilityLevel: 1 | 2 | 3;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ========================================
// CHAT TYPES
// ========================================

export interface IConversationParticipant {
  user: Types.ObjectId;
  joinedAt: Date;
  lastReadAt?: Date;
  isActive: boolean;
}

export interface ILastMessage {
  content: string;
  sender: Types.ObjectId;
  timestamp: Date;
}

export interface IConversation extends Document {
  _id: Types.ObjectId;
  type: 'direct' | 'group';
  name?: string;
  participants: IConversationParticipant[];
  createdBy: Types.ObjectId;
  lastMessage?: ILastMessage;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage extends Document {
  _id: Types.ObjectId;
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  messageType: 'text' | 'file' | 'image';
  content: string;
  fileUrl?: string;
  fileName?: string;
  isEdited: boolean;
  isDeleted: boolean;
  readBy: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// ========================================
// KNOWLEDGE BASE TYPES
// ========================================

export interface IArticleAttachment {
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: Date;
}

export interface IKnowledgeArticle extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  summary: string;
  sustainabilityLevel: 1 | 2 | 3;
  category: string;
  tags: string[];
  author: Types.ObjectId;
  attachments: IArticleAttachment[];
  featured: boolean;
  viewCount: number;
  status: 'draft' | 'published';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ========================================
// NEWS TYPES
// ========================================

export interface INewsArticle extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  summary: string;
  imageUrl?: string;
  category: 'Global' | 'Regional' | 'Industry';
  tags: string[];
  author: Types.ObjectId;
  source?: string;
  sourceUrl?: string;
  featured: boolean;
  viewCount: number;
  status: 'draft' | 'published';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ========================================
// CARBON TRACKING TYPES
// ========================================

export interface ICarbonEntry extends Document {
  _id: Types.ObjectId;
  organization: Types.ObjectId;
  sustainabilityLevel: 1 | 2 | 3;
  entryDate: Date;
  entryType: 'electricity' | 'fuel' | 'transport' | 'waste' | 'water' | 'renewable_energy' | 'carbon_offset';
  quantity: number;
  unit: string;
  emissionFactor: Types.ObjectId;
  co2Equivalent: number;
  notes?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEmissionFactor extends Document {
  _id: Types.ObjectId;
  category: string;
  subCategory?: string;
  description: string;
  factorValue: number;
  unit: string;
  source: string;
  region: string;
  sustainabilityLevel: 1 | 2 | 3;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMilestone {
  number: number;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: Date;
}

export interface ISustainabilityRoadmap extends Document {
  _id: Types.ObjectId;
  organization: Types.ObjectId;
  currentLevel: 1 | 2 | 3;
  milestones: IMilestone[];
  progressPercentage: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface ISustainabilityGoal extends Document {
  _id: Types.ObjectId;
  organization: Types.ObjectId;
  level: 1 | 2 | 3;
  targetYear: number;
  targetReductionPercentage: number;
  baselineEmissions?: number;
  currentEmissions?: number;
  status: 'in_progress' | 'achieved' | 'failed';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ========================================
// REQUEST TYPES
// ========================================

export interface AuthRequest extends Request {
  user?: {
    id: string;
    userId: string;
    email: string;
    role: string;
    organization: string;
  };
}

export interface JWTPayload {
  id: string;
  userId: string;
  email: string;
  role: string;
  organization: string;
}

// ========================================
// API RESPONSE TYPES
// ========================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: any[];
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ========================================
// SOCKET.IO TYPES
// ========================================

export interface SocketUser {
  userId: string;
  socketId: string;
  organizationId: string;
}

export interface TypingData {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface MessageData {
  conversationId: string;
  senderId: string;
  messageType: 'text' | 'file' | 'image';
  content: string;
  fileUrl?: string;
  fileName?: string;
}

// ========================================
// EMAIL TYPES
// ========================================

export interface EmailOptions {
  to: string;
  subject: string;
  template?: string;
  context?: any;
  html?: string;
  text?: string;
}

// ========================================
// ENVIRONMENT TYPES
// ========================================

export interface Environment {
  NODE_ENV: string;
  PORT: number;
  API_VERSION: string;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASSWORD: string;
  EMAIL_FROM: string;
  FRONTEND_URL: string;
  ALLOWED_ORIGINS: string;
  BCRYPT_SALT_ROUNDS: number;
  MAX_FILE_SIZE: number;
  ALLOWED_FILE_TYPES: string;
}
