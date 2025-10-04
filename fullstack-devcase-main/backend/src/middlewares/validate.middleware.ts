import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { errorResponse } from '../utils/responseHandler';

export const validate = (schema: AnyZodObject, source: 'body' | 'query' = 'body') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = source === 'body' ? req.body : req.query;
      const validated = await schema.parseAsync(data);
      
      if (source === 'body') {
        req.body = validated;
      } else {
        req.query = validated as any;
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        return errorResponse(res, 'Validation failed', 400, errors);
      }
      next(error);
    }
  };
};