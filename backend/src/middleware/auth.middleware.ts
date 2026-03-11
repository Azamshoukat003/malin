import type { NextFunction, Response } from 'express';
import User from '../models/User.model';
import { verifySessionToken } from '../services/auth.service';
import { fail } from '../utils/response';
import type { AuthRequest } from '../types/express';

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const token = req.cookies?.malinkiddy_session as string | undefined;
    if (!token) return fail(res, 401, 'Nicht angemeldet');

    const decoded = verifySessionToken(token);
    const user = await User.findById(decoded.userId).select('_id email childName').lean();
    if (!user) return fail(res, 401, 'Benutzer nicht gefunden');

    req.user = { userId: String(user._id), email: user.email };
    next();
  } catch {
    return fail(res, 401, 'Ungültiger Token');
  }
};
