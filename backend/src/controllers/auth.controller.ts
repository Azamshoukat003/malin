import { createHash, randomInt, randomUUID } from 'crypto';
import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import User from '../models/User.model';
import { sendMagicLinkEmail, sendPasswordResetOtpEmail } from '../services/email.service';
import {
  REFRESH_TOKEN_MAX_AGE_MS,
  SESSION_TOKEN_MAX_AGE_MS,
  signAdminToken,
  signMagicLinkToken,
  signRefreshToken,
  signSessionToken,
  verifyRefreshToken,
  verifyMagicLinkToken
} from '../services/auth.service';
import { ok, fail } from '../utils/response';
import type { AuthRequest } from '../types/express';
import AdminUser from '../models/AdminUser.model';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';

export const requestMagicLinkSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase())
});

export const verifyQuerySchema = z.object({
  token: z.string().min(1)
});

export const adminLoginSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
  password: z.string().min(8)
});

export const registerSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
  password: z.string().min(8),
  childName: z.string().trim().min(1).max(120).optional()
});

export const loginSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
  password: z.string().min(8)
});

export const requestPasswordResetOtpSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase())
});

export const verifyPasswordResetOtpSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
  otp: z.string().regex(/^\d{6}$/)
});

export const resetPasswordWithOtpSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
  otp: z.string().regex(/^\d{6}$/),
  password: z.string().min(8)
});

const PASSWORD_RESET_OTP_EXPIRY_MS = 10 * 60 * 1000;
const PASSWORD_RESET_MAX_ATTEMPTS = 5;
const GENERIC_OTP_REQUEST_MESSAGE = 'Wenn ein Konto existiert, wurde ein Code gesendet.';
const INVALID_OTP_MESSAGE = 'Ungültiger oder abgelaufener Code';
const SESSION_UNAUTHORIZED_MESSAGE = 'Nicht angemeldet';

const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const
});

const setUserSessionCookie = (res: Response, sessionToken: string): void => {
  res.cookie('malinkiddy_session', sessionToken, {
    ...getAuthCookieOptions(),
    maxAge: SESSION_TOKEN_MAX_AGE_MS
  });
};

const setUserRefreshCookie = (res: Response, refreshToken: string): void => {
  res.cookie('malinkiddy_refresh', refreshToken, {
    ...getAuthCookieOptions(),
    maxAge: REFRESH_TOKEN_MAX_AGE_MS
  });
};

const clearUserAuthCookies = (res: Response): void => {
  res.clearCookie('malinkiddy_session');
  res.clearCookie('malinkiddy_refresh');
};

const hashRefreshTokenId = (tokenId: string): string =>
  createHash('sha256').update(tokenId).digest('hex');

const issueUserAuthTokens = async (
  res: Response,
  user: {
    _id: unknown;
    email: string;
    refreshTokenHash?: string | null;
    refreshTokenExpiry?: Date | null;
    save: () => Promise<unknown>;
  }
): Promise<void> => {
  const userId = String(user._id);
  const sessionToken = signSessionToken({ userId, email: user.email });
  const refreshTokenId = randomUUID();
  const refreshToken = signRefreshToken({ userId, email: user.email, tokenId: refreshTokenId, type: 'refresh' });

  user.refreshTokenHash = hashRefreshTokenId(refreshTokenId);
  user.refreshTokenExpiry = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE_MS);
  await user.save();

  setUserSessionCookie(res, sessionToken);
  setUserRefreshCookie(res, refreshToken);
};

type ResettableAccount = {
  passwordHash?: string | null;
  passwordResetOtpHash?: string | null;
  passwordResetOtpExpiry?: Date | null;
  passwordResetOtpAttempts?: number;
  save: () => Promise<unknown>;
};

const findResettableAccountByEmail = async (email: string): Promise<ResettableAccount | null> => {
  const admin = await AdminUser.findOne({ email });
  if (admin) return admin as unknown as ResettableAccount;

  const user = await User.findOne({ email });
  if (user) return user as unknown as ResettableAccount;

  return null;
};

const clearPasswordResetOtp = (account: ResettableAccount): void => {
  account.passwordResetOtpHash = null;
  account.passwordResetOtpExpiry = null;
  account.passwordResetOtpAttempts = 0;
};

const validatePasswordResetOtp = async (
  account: ResettableAccount,
  otp: string
): Promise<{ valid: boolean; message?: string }> => {
  if (!account.passwordResetOtpHash || !account.passwordResetOtpExpiry) {
    return { valid: false, message: INVALID_OTP_MESSAGE };
  }

  if (account.passwordResetOtpExpiry.getTime() <= Date.now()) {
    clearPasswordResetOtp(account);
    await account.save();
    return { valid: false, message: INVALID_OTP_MESSAGE };
  }

  const attempts = account.passwordResetOtpAttempts ?? 0;
  if (attempts >= PASSWORD_RESET_MAX_ATTEMPTS) {
    clearPasswordResetOtp(account);
    await account.save();
    return { valid: false, message: 'Zu viele Fehlversuche. Bitte fordere einen neuen Code an.' };
  }

  const isMatch = await bcrypt.compare(otp, account.passwordResetOtpHash);
  if (!isMatch) {
    const nextAttempts = attempts + 1;
    account.passwordResetOtpAttempts = nextAttempts;
    if (nextAttempts >= PASSWORD_RESET_MAX_ATTEMPTS) {
      clearPasswordResetOtp(account);
    }
    await account.save();
    return { valid: false, message: INVALID_OTP_MESSAGE };
  }

  return { valid: true };
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, childName } = registerSchema.parse(req.body);

    const existingAdmin = await AdminUser.findOne({ email }).select('_id').lean();
    if (existingAdmin) {
      fail(res, 409, 'Diese E-Mail ist bereits vergeben');
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ email });

    if (existingUser?.passwordHash) {
      fail(res, 409, 'Diese E-Mail ist bereits vergeben');
      return;
    }

    const sanitizedChildName = childName?.trim() ? childName.trim() : null;

    if (existingUser) {
      existingUser.passwordHash = passwordHash;
      existingUser.childName = sanitizedChildName ?? existingUser.childName ?? null;
      await existingUser.save();
    } else {
      await User.create({
        email,
        passwordHash,
        childName: sanitizedChildName,
        magicLinkUsed: true
      });
    }

    ok(res, { message: 'Registrierung erfolgreich' });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const admin = await AdminUser.findOne({ email });
    if (admin) {
      const isAdminMatch = await bcrypt.compare(password, admin.passwordHash);
      if (!isAdminMatch) {
        fail(res, 401, 'Ungültige Zugangsdaten');
        return;
      }

      const adminToken = signAdminToken(String(admin._id));
      res.cookie('malinkiddy_admin_session', adminToken, {
        ...getAuthCookieOptions(),
        maxAge: 8 * 60 * 60 * 1000
      });
      clearUserAuthCookies(res);
      ok(res, { role: 'admin' as const });
      return;
    }

    const user = await User.findOne({ email });
    if (!user?.passwordHash) {
      fail(res, 401, 'Ungültige Zugangsdaten');
      return;
    }

    const isUserMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isUserMatch) {
      fail(res, 401, 'Ungültige Zugangsdaten');
      return;
    }

    user.lastLoginAt = new Date();
    await issueUserAuthTokens(res, user);
    res.clearCookie('malinkiddy_admin_session');
    ok(res, { role: 'user' as const });
  } catch (err) {
    next(err);
  }
};

export const requestMagicLink = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = requestMagicLinkSchema.parse(req.body);
    const token = signMagicLinkToken(email);
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await User.findOneAndUpdate(
      { email },
      { email, magicLinkToken: token, magicLinkExpiry: expiry, magicLinkUsed: false },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await sendMagicLinkEmail(email, token);
    ok(res, { message: 'Magic Link wurde gesendet' });
  } catch (err) {
    next(err);
  }
};

export const verifyMagicLink = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = verifyQuerySchema.parse(req.query);
    const decoded = verifyMagicLinkToken(token);
    if (decoded.type !== 'magic-link') {
      fail(res, 401, 'Dieser Link ist abgelaufen oder ungültig.');
      return;
    }

    const user = await User.findOne({
      email: decoded.email,
      magicLinkToken: token,
      magicLinkUsed: false,
      magicLinkExpiry: { $gt: new Date() }
    });

    if (!user) {
      fail(res, 401, 'Dieser Link ist abgelaufen oder ungültig.');
      return;
    }

    user.magicLinkUsed = true;
    user.lastLoginAt = new Date();
    await issueUserAuthTokens(res, user);

    ok(res, { email: user.email, childName: user.childName ?? null });
  } catch (err) {
    next(err);
  }
};

export const refreshSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies?.malinkiddy_refresh as string | undefined;
    if (!refreshToken) {
      fail(res, 401, SESSION_UNAUTHORIZED_MESSAGE);
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (decoded.type !== 'refresh') {
      clearUserAuthCookies(res);
      fail(res, 401, SESSION_UNAUTHORIZED_MESSAGE);
      return;
    }

    const user = await User.findById(decoded.userId);
    if (!user?.refreshTokenHash || !user.refreshTokenExpiry) {
      clearUserAuthCookies(res);
      fail(res, 401, SESSION_UNAUTHORIZED_MESSAGE);
      return;
    }

    if (user.refreshTokenExpiry.getTime() <= Date.now()) {
      user.refreshTokenHash = null;
      user.refreshTokenExpiry = null;
      await user.save();
      clearUserAuthCookies(res);
      fail(res, 401, SESSION_UNAUTHORIZED_MESSAGE);
      return;
    }

    if (hashRefreshTokenId(decoded.tokenId) !== user.refreshTokenHash) {
      user.refreshTokenHash = null;
      user.refreshTokenExpiry = null;
      await user.save();
      clearUserAuthCookies(res);
      fail(res, 401, SESSION_UNAUTHORIZED_MESSAGE);
      return;
    }

    user.lastLoginAt = new Date();
    await issueUserAuthTokens(res, user);
    ok(res, { refreshed: true });
  } catch {
    clearUserAuthCookies(res);
    fail(res, 401, SESSION_UNAUTHORIZED_MESSAGE);
  }
};

export const requestPasswordResetOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = requestPasswordResetOtpSchema.parse(req.body);
    const account = await findResettableAccountByEmail(email);

    if (account) {
      const otp = String(randomInt(100000, 1000000));
      account.passwordResetOtpHash = await bcrypt.hash(otp, 10);
      account.passwordResetOtpExpiry = new Date(Date.now() + PASSWORD_RESET_OTP_EXPIRY_MS);
      account.passwordResetOtpAttempts = 0;
      await account.save();
      await sendPasswordResetOtpEmail(email, otp);
    }

    ok(res, { message: GENERIC_OTP_REQUEST_MESSAGE });
  } catch (err) {
    next(err);
  }
};

export const verifyPasswordResetOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp } = verifyPasswordResetOtpSchema.parse(req.body);
    const account = await findResettableAccountByEmail(email);
    if (!account) {
      fail(res, 400, INVALID_OTP_MESSAGE);
      return;
    }

    const validation = await validatePasswordResetOtp(account, otp);
    if (!validation.valid) {
      fail(res, 400, validation.message ?? INVALID_OTP_MESSAGE);
      return;
    }

    ok(res, { verified: true });
  } catch (err) {
    next(err);
  }
};

export const resetPasswordWithOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp, password } = resetPasswordWithOtpSchema.parse(req.body);
    const account = await findResettableAccountByEmail(email);
    if (!account) {
      fail(res, 400, INVALID_OTP_MESSAGE);
      return;
    }

    const validation = await validatePasswordResetOtp(account, otp);
    if (!validation.valid) {
      fail(res, 400, validation.message ?? INVALID_OTP_MESSAGE);
      return;
    }

    account.passwordHash = await bcrypt.hash(password, 10);
    clearPasswordResetOtp(account);
    await account.save();

    ok(res, { message: 'Passwort erfolgreich zurückgesetzt' });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshToken = req.cookies?.malinkiddy_refresh as string | undefined;
    if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        if (decoded.type === 'refresh') {
          await User.findByIdAndUpdate(decoded.userId, {
            refreshTokenHash: null,
            refreshTokenExpiry: null
          });
        }
      } catch {
        // Ignore malformed/expired refresh token during logout.
      }
    }

    clearUserAuthCookies(res);
    res.clearCookie('malinkiddy_admin_session');
    ok(res, { message: 'Abgemeldet' });
  } catch (err) {
    next(err);
  }
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      fail(res, 401, 'Nicht angemeldet');
      return;
    }
    const user = await User.findById(req.user.userId).select('_id email childName').lean();
    if (!user) {
      fail(res, 401, 'Benutzer nicht gefunden');
      return;
    }
    ok(res, { userId: String(user._id), email: user.email, childName: user.childName ?? null });
  } catch (err) {
    next(err);
  }
};

export const adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = adminLoginSchema.parse(req.body);
    const admin = await AdminUser.findOne({ email });
    if (!admin) {
      fail(res, 401, 'Ungültige Zugangsdaten');
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      fail(res, 401, 'Ungültige Zugangsdaten');
      return;
    }

    const token = signAdminToken(String(admin._id));
    res.cookie('malinkiddy_admin_session', token, {
      ...getAuthCookieOptions(),
      maxAge: 8 * 60 * 60 * 1000
    });

    ok(res, { message: 'Admin angemeldet' });
  } catch (err) {
    next(err);
  }
};
