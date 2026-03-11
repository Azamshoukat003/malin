import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface MagicLinkPayload {
  email: string;
  type: 'magic-link';
}

export interface SessionPayload {
  userId: string;
  email: string;
}

export interface RefreshPayload extends SessionPayload {
  tokenId: string;
  type: 'refresh';
}

export interface AdminPayload {
  adminId: string;
  isAdmin: true;
}

export const SESSION_TOKEN_MAX_AGE_MS = env.ACCESS_TOKEN_TTL_MINUTES * 60 * 1000;
export const REFRESH_TOKEN_MAX_AGE_MS = env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;

export const signMagicLinkToken = (email: string): string =>
  jwt.sign({ email, type: 'magic-link' } as MagicLinkPayload, env.JWT_SECRET, { expiresIn: '15m' });

export const verifyMagicLinkToken = (token: string): MagicLinkPayload =>
  jwt.verify(token, env.JWT_SECRET) as MagicLinkPayload;

export const signSessionToken = (payload: SessionPayload): string =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: `${env.ACCESS_TOKEN_TTL_MINUTES}m` });

export const verifySessionToken = (token: string): SessionPayload =>
  jwt.verify(token, env.JWT_SECRET) as SessionPayload;

export const signRefreshToken = (payload: RefreshPayload): string =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d` });

export const verifyRefreshToken = (token: string): RefreshPayload =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshPayload;

export const signAdminToken = (adminId: string): string =>
  jwt.sign({ adminId, isAdmin: true } as AdminPayload, env.JWT_SECRET, { expiresIn: '8h' });

export const verifyAdminToken = (token: string): AdminPayload =>
  jwt.verify(token, env.JWT_SECRET) as AdminPayload;
