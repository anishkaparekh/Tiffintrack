import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { ApiError } from './utils/ApiError';

import mongoose from 'mongoose';

const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5175';
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Development/Production HTTP logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parsing headers
app.use(cookieParser());

// Rate limiter for API routes
const limiter = rateLimit({
  max: process.env.NODE_ENV === 'development' ? 100000 : 100, // Limit each IP to 100 requests per windowMs (100k in dev)
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again in 15 minutes!',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Base Health Check endpoint
app.get('/api/health', (_req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    const dbStatus = isConnected ? 'connected' : 'disconnected';
    
    if (!isConnected) {
      return res.status(500).json({
        success: false,
        message: 'TiffinTrack API is running but database is disconnected',
        database: dbStatus,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'TiffinTrack API is running',
      database: dbStatus,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message || error,
    });
  }
});
// Database Status endpoint
app.get('/api/db-status', (_req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(isConnected ? 200 : 500).json({
    success: isConnected,
    database: isConnected ? 'connected' : 'disconnected',
  });
});

// Register versioned api router
app.use('/api/v1', routes);

// Register direct auth api route
import authRoutes from './routes/auth.routes';
app.use('/api/auth', authRoutes);

// Wildcard undefined route catcher
app.all('*', (req, _res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found on this server`));
});
app.use(errorHandler);

export default app;
