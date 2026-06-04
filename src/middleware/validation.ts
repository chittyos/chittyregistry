// Validation Middleware using Zod schemas

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { logger } from '../utils/logger';

/**
 * Middleware to validate request body against a Zod schema
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        logger.warn('Request body validation failed', {
          errors,
          body: req.body,
          path: req.path
        });

        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors
        });
        return;
      }

      // Replace request body with validated data
      req.body = result.data;
      next();

    } catch (error) {
      logger.error('Validation middleware error', { error: error.message });
      res.status(500).json({
        success: false,
        error: 'Validation service error'
      });
    }
  };
}

/**
 * Middleware to validate query parameters against a Zod schema
 */
export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.query);

      if (!result.success) {
        const errors = result.error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        logger.warn('Query validation failed', {
          errors,
          query: req.query,
          path: req.path
        });

        res.status(400).json({
          success: false,
          error: 'Query validation failed',
          details: errors
        });
        return;
      }

      // Replace query with validated data. Express 5 makes req.query a
      // read-only getter, so redefine the property instead of assigning.
      Object.defineProperty(req, 'query', {
        value: result.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
      next();

    } catch (error) {
      logger.error('Query validation middleware error', { error: error.message });
      res.status(500).json({
        success: false,
        error: 'Validation service error'
      });
    }
  };
}

/**
 * Middleware to validate URL parameters against a Zod schema
 */
export function validateParams<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.params);

      if (!result.success) {
        const errors = result.error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        logger.warn('Params validation failed', {
          errors,
          params: req.params,
          path: req.path
        });

        res.status(400).json({
          success: false,
          error: 'Parameter validation failed',
          details: errors
        });
        return;
      }

      // Mirror validateQuery's defineProperty pattern — Express 5 may make req.params
      // a read-only getter in a future patch; this stays compatible either way.
      Object.defineProperty(req, 'params', {
        value: result.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
      next();

    } catch (error) {
      logger.error('Params validation middleware error', { error: error.message });
      res.status(500).json({
        success: false,
        error: 'Validation service error'
      });
    }
  };
}

/**
 * Generic validation error handler
 */
export function handleValidationError(error: any, req: Request, res: Response, next: NextFunction): void {
  if (error instanceof ZodError) {
    const errors = error.issues.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code
    }));

    logger.warn('Validation error caught by error handler', {
      errors,
      path: req.path
    });

    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
    return;
  }

  next(error);
}