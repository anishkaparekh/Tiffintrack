import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

/**
 * Global Express error handling middleware.
 * Formats error responses and hides trace stack details in production.
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';

    // Handle Mongoose cast error (e.g., invalid ObjectId)
    if (error.name === 'CastError') {
      statusCode = 400;
      message = `Invalid field value: ${error.path}`;
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(error.errors)
        .map((el: any) => el.message)
        .join(', ');
    }

    // Handle Mongoose duplicate key errors
    if (error.code === 11000) {
      statusCode = 400;
      const field = Object.keys(error.keyValue)[0];
      message = `Duplicate field value entered: ${field}. Please use another value.`;
    }

    // Handle JsonWebToken errors
    if (error.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token. Please log in again.';
    }

    if (error.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token has expired. Please log in again.';
    }

    error = new ApiError(statusCode, message, false, err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  if (process.env.NODE_ENV === 'development') {
    console.error('Error occurred:', err);
  }

  res.status(error.statusCode).json(response);
};
