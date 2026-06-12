import dotenv from 'dotenv';
// Load environment variables first
dotenv.config();

import app from './app';
import { connectDB, closeDB } from './config/db';

const PORT = process.env.PORT || 5000;

/**
 * Boots the server by establishing database connections first,
 * then starting the Express HTTP server.
 */
const startServer = async () => {
  try {
    // 1. Connect to MongoDB Atlas
    await connectDB();

    // 2. Start Express Server
    const server = app.listen(PORT, () => {
      console.log(`[Server] running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err: any) => {
      console.error('[Unhandled Rejection] Shutting down server...');
      console.error(err);
      server.close(() => {
        closeDB().then(() => {
          process.exit(1);
        });
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err: any) => {
      console.error('[Uncaught Exception] Shutting down server...');
      console.error(err);
      server.close(() => {
        closeDB().then(() => {
          process.exit(1);
        });
      });
    });

    // Graceful shut down signals (SIGINT / SIGTERM)
    const shutdownGracefully = (signal: string) => {
      console.log(`[${signal}] signal received. Shutting down gracefully...`);
      server.close(async () => {
        await closeDB();
        console.log('HTTP server closed. Process terminated.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdownGracefully('SIGTERM'));
    process.on('SIGINT', () => shutdownGracefully('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
