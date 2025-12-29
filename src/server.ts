import http from 'http';
import { Server as SocketServer } from 'socket.io';
import app from './app';
import config from './config/environment';
import connectDatabase from './config/database';
import { setupChatSocket } from './sockets/chat.socket';
import logger from './utils/logger';

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = new SocketServer(server, {
  cors: {
    origin: config.ALLOWED_ORIGINS,
    credentials: true,
  },
});

// Store io instance in app for access in controllers
app.set('io', io);

// Setup chat socket handlers
setupChatSocket(io);

// Connect to database
connectDatabase();

// Start server
const PORT = config.PORT || 5000;

server.listen(PORT, () => {
  logger.info(`
    ╔═══════════════════════════════════════╗
    ║                                       ║
    ║     🌱 SOLIDIFY BACKEND STARTED      ║
    ║                                       ║
    ╚═══════════════════════════════════════╝

    📍 Environment: ${config.NODE_ENV}
    🚀 Server: http://localhost:${PORT}
    📡 API: http://localhost:${PORT}/api/${config.API_VERSION}
    🔌 Socket.io: Connected
    📊 Health: http://localhost:${PORT}/health

    🌍 Working towards Net Zero Carbon Emissions
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Handle unhandled rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

export { io };
