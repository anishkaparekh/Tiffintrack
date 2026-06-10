import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

/**
 * Middleware wrapper to validate incoming Express requests against Zod schemas.
 */
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Collect readable error messages from Zod validation issues
        const errorMessages = error.errors
          .map((err) => {
            const fieldPath = err.path.slice(1).join('.'); // Skip 'body', 'query', or 'params' prefix
            return fieldPath ? `${fieldPath}: ${err.message}` : err.message;
          })
          .join(', ');

        return next(new ApiError(400, errorMessages));
      }
      next(error);
    }
  };
};
