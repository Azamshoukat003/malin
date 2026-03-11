import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { fail } from '../utils/response';

export const validateBody =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction): Response | void => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return fail(res, 400, parsed.error.issues[0]?.message ?? 'Ungültige Eingaben');
    req.body = parsed.data;
    next();
  };
