export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
} as const;

export const ORGANIZATION_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
} as const;

export const SUSTAINABILITY_LEVELS = {
  LEVEL_1: 1,
  LEVEL_2: 2,
  LEVEL_3: 3,
} as const;

export const SUSTAINABILITY_LEVEL_NAMES = {
  1: 'Foundation & Measurement',
  2: 'Efficiency & Integration',
  3: 'Transformation & Net Zero Leadership',
} as const;

export const CONVERSATION_TYPES = {
  DIRECT: 'direct',
  GROUP: 'group',
} as const;

export const MESSAGE_TYPES = {
  TEXT: 'text',
  FILE: 'file',
  IMAGE: 'image',
} as const;

export const CONTENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
} as const;

export const NEWS_CATEGORIES = {
  POLICY: 'policy',
  TECHNOLOGY: 'technology',
  SUCCESS_STORIES: 'success-stories',
  EVENTS: 'events',
  GLOBAL_TRENDS: 'global-trends',
} as const;

export const CARBON_ENTRY_TYPES = {
  ELECTRICITY: 'electricity',
  FUEL: 'fuel',
  TRANSPORT: 'transport',
  WASTE: 'waste',
  WATER: 'water',
  RENEWABLE_ENERGY: 'renewable_energy',
  CARBON_OFFSET: 'carbon_offset',
} as const;

export const GOAL_STATUS = {
  IN_PROGRESS: 'in_progress',
  ACHIEVED: 'achieved',
  FAILED: 'failed',
} as const;

export const COURSE_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export const COMPLETION_CRITERIA_TYPES = {
  READ: 'read',
  QUIZ: 'quiz',
  ASSESSMENT: 'assessment',
} as const;

export const RESOURCE_TYPES = {
  PDF: 'pdf',
  VIDEO: 'video',
  LINK: 'link',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  // Auth
  INVALID_CREDENTIALS: 'Invalid credentials',
  UNAUTHORIZED: 'Unauthorized access',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_TOKEN: 'Invalid token',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  USER_ID_ALREADY_EXISTS: 'User ID already exists',
  USER_NOT_FOUND: 'User not found',

  // Organization
  ORGANIZATION_NOT_FOUND: 'Organization not found',

  // Validation
  VALIDATION_ERROR: 'Validation error',
  INVALID_EMAIL: 'Invalid email format',
  WEAK_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and number',

  // Chat
  CONVERSATION_NOT_FOUND: 'Conversation not found',
  MESSAGE_NOT_FOUND: 'Message not found',
  NOT_PARTICIPANT: 'You are not a participant in this conversation',

  // Content
  ARTICLE_NOT_FOUND: 'Article not found',
  NEWS_NOT_FOUND: 'News article not found',

  // Learning
  COURSE_NOT_FOUND: 'Course not found',
  COURSE_ALREADY_COMPLETED: 'Course already completed',
  COURSE_NOT_AVAILABLE: 'Course not available for your current level',
  LEVEL_NOT_COMPLETED: 'Previous level must be completed first',

  // Carbon
  CARBON_ENTRY_NOT_FOUND: 'Carbon entry not found',
  EMISSION_FACTOR_NOT_FOUND: 'Emission factor not found',

  // General
  SERVER_ERROR: 'Internal server error',
  NOT_FOUND: 'Resource not found',
  FORBIDDEN: 'Access forbidden',
} as const;

export const SUCCESS_MESSAGES = {
  // Auth
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTRATION_SUCCESS: 'Registration successful',
  PASSWORD_CHANGED: 'Password changed successfully',
  PASSWORD_RESET_SENT: 'Password reset link sent to your email',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
  EMAIL_VERIFIED: 'Email verified successfully',

  // User
  USER_UPDATED: 'User profile updated successfully',
  AVATAR_UPDATED: 'Avatar updated successfully',

  // Organization
  ORGANIZATION_CREATED: 'Organization created successfully',
  ORGANIZATION_UPDATED: 'Organization updated successfully',

  // Chat
  CONVERSATION_CREATED: 'Conversation created successfully',
  MESSAGE_SENT: 'Message sent successfully',
  MESSAGE_UPDATED: 'Message updated successfully',
  MESSAGE_DELETED: 'Message deleted successfully',

  // Knowledge Base
  ARTICLE_CREATED: 'Article created successfully',
  ARTICLE_UPDATED: 'Article updated successfully',
  ARTICLE_DELETED: 'Article deleted successfully',

  // News
  NEWS_CREATED: 'News article created successfully',
  NEWS_UPDATED: 'News article updated successfully',
  NEWS_DELETED: 'News article deleted successfully',

  // Carbon
  ENTRY_CREATED: 'Carbon entry created successfully',
  ENTRY_UPDATED: 'Carbon entry updated successfully',
  ENTRY_DELETED: 'Carbon entry deleted successfully',
  GOAL_CREATED: 'Sustainability goal created successfully',
  ROADMAP_UPDATED: 'Roadmap updated successfully',

  // Learning
  COURSE_CREATED: 'Course created successfully',
  COURSE_UPDATED: 'Course updated successfully',
  COURSE_DELETED: 'Course deleted successfully',
  COURSE_STARTED: 'Course started successfully',
  COURSE_COMPLETED: 'Course completed successfully',
  LEVEL_COMPLETED: 'Congratulations! Level completed',
  LEVEL_ADVANCED: 'Your organization has advanced to the next level',
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
} as const;

export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',

  // Chat
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  SEND_MESSAGE: 'send_message',
  NEW_MESSAGE: 'new_message',
  MESSAGE_DELIVERED: 'message_delivered',
  MESSAGE_READ: 'message_read',

  // Typing
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  USER_TYPING: 'user_typing',

  // Online status
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',

  // Errors
  ERROR: 'error',
} as const;

export const ROADMAP_MILESTONES = [
  {
    number: 1,
    title: 'Initial Assessment',
    description: 'Complete baseline carbon footprint assessment'
  },
  {
    number: 2,
    title: 'Data Collection System',
    description: 'Establish regular data collection processes'
  },
  {
    number: 3,
    title: 'Efficiency Improvements',
    description: 'Implement initial efficiency measures'
  },
  {
    number: 4,
    title: 'Renewable Integration',
    description: 'Begin renewable energy integration'
  },
  {
    number: 5,
    title: 'Advanced Optimization',
    description: 'Deploy advanced carbon reduction strategies'
  },
  {
    number: 6,
    title: 'Net Zero Achievement',
    description: 'Achieve net zero carbon emissions'
  }
] as const;
