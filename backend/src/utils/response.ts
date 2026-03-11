import type { Response } from 'express';

export const ok = <T>(res: Response, data?: T, status = 200): Response =>
  res.status(status).json({ success: true, data: data ?? null, error: null });

export const fail = (res: Response, status: number, error: string): Response =>
  res.status(status).json({ success: false, data: null, error });
