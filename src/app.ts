import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import config from './config/environment';
import { swaggerSpec } from './config/swagger';
import { customSwaggerCSS, customSwaggerHTML } from './config/swagger-theme';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import logger from './utils/logger';

const app: Application = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for Swagger UI
}));
app.use(mongoSanitize());

// CORS
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list
    if (config.ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    // Allow same-host requests (for Swagger UI)
    try {
      const requestUrl = new URL(origin);

      // In development, allow all localhost requests
      if (config.NODE_ENV === 'development' && requestUrl.hostname === 'localhost') {
        return callback(null, true);
      }

      // In production, allow requests from the same domain
      if (config.NODE_ENV === 'production') {
        const allowedUrl = new URL('https://solidify-api.onrender.com');
        if (requestUrl.host === allowedUrl.host) {
          return callback(null, true);
        }
      }
    } catch (error) {
      // Invalid URL, reject
      return callback(new Error('Not allowed by CORS'));
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression
app.use(compression() as any);

// Logging
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve as any, swaggerUi.setup(swaggerSpec, {
  customCss: customSwaggerCSS,
  customSiteTitle: '🌱 Solidify API - Carbon Management Platform',
  customfavIcon: 'https://cdn-icons-png.flaticon.com/512/3065/3065363.png',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    syntaxHighlight: {
      theme: 'monokai'
    },
    tryItOutEnabled: true,
    docExpansion: 'none',
    defaultModelsExpandDepth: 3,
    defaultModelExpandDepth: 3,
  },
}) as any);

// Swagger JSON endpoint
app.get('/api-docs.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API routes
app.use(`/api/${config.API_VERSION}`, routes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

export default app;
