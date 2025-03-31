import { RequestHandler } from 'express';

/**
 * Converts a controller function to an Express RequestHandler
 * This is a workaround for TypeScript type issues with Express route handlers
 */
export const asHandler = <T extends (...args: any[]) => any>(fn: T): RequestHandler => {
  return fn as unknown as RequestHandler;
}; 