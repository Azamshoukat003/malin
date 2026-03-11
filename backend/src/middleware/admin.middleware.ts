import type { NextFunction, Response } from 'express';
import AdminUser from '../models/AdminUser.model';
import { verifyAdminToken } from '../services/auth.service';
import { fail } from '../utils/response';
import type { AuthRequest } from '../types/express';

export const adminMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const token = req.cookies?.malinkiddy_admin_session as string | undefined;
    if (!token) return fail(res, 401, 'Nicht angemeldet');

    const decoded = verifyAdminToken(token);
    const admin = await AdminUser.findById(decoded.adminId).select('_id').lean();
    if (!admin) return fail(res, 401, 'Admin nicht gefunden');

    req.admin = { adminId: String(admin._id) };
    next();
  } catch {
    return fail(res, 401, 'Ungültiger Admin-Token');
  }
};
