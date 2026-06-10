import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an asynchronous Express request handler to catch any rejected promises
 * and pass them to the next middleware (error handler).
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
