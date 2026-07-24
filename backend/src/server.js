const env = require('./config/environment');
const logger = require('./utils/logger');
const { connectDB, disconnectDB } = require('./config/database');
const { initTelegramBot } = require('./telegram');
const app = require('./app');

let server;

// Handle uncaught exceptions globally
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, { stack: error.stack });
  process.exit(1);
});

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Initialize Telegram Bot Module (Phase 2 stub)
  initTelegramBot();

  // Start HTTP Server
  server = app.listen(env.PORT, () => {
    logger.info(
      `🚀 ${env.APP_NAME} Backend running on port ${env.PORT} in [${env.NODE_ENV}] mode`
    );
    logger.info(`Health check available at: http://localhost:${env.PORT}${env.API_PREFIX}/health`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection detected:', reason);
    if (server) {
      server.close(() => {
        logger.info('Server closed due to unhandled promise rejection');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
};

// Graceful Shutdown handler
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed.');
      await disconnectDB();
      logger.info('Graceful shutdown completed successfully.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

startServer();
