import type { Request } from 'express';

export interface SessionUser {
  userId: string;
  email: string;
}

export interface SessionAdmin {
  adminId: string;
}

export interface AuthRequest extends Request {
  user?: SessionUser;
  admin?: SessionAdmin;
}
