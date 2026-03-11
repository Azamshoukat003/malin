import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  void req;
  void next;
  const isProd = env.NODE_ENV === 'production';
  return res.status(500).json({
    success: false,
    data: null,
    error: isProd ? 'Interner Serverfehler' : err.message
  });
};
