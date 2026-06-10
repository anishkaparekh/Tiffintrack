import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';
import { UserRole } from '../constants/roles';

// Extend the Express Request interface to include req.user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware to authenticate requests by verifying JWT access tokens.
 * Checks the Authorization header (Bearer) and signed/unsigned cookies.
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  let token: string | undefined;

  // Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check cookie parse
  else if (req.cookies) {
    token = req.cookies.token || req.cookies.accessToken;
  }

  if (!token) {
    return next(new ApiError(401, 'Access denied. No token provided.'));
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired token. Please log in again.'));
  }
};

/**
 * Middleware to restrict route access to specific roles.
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'User not authenticated.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Access denied. Role '${req.user.role}' is not authorized to access this route.`)
      );
    }

    next();
  };
};
