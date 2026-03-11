import type { NextFunction, Response } from 'express';
import { z } from 'zod';
import QRCode from '../models/QRCode.model';
import AudioMemory from '../models/AudioMemory.model';
import User from '../models/User.model';
import { fail, ok } from '../utils/response';
import type { AuthRequest } from '../types/express';

export const updateProfileSchema = z.object({
  childName: z.string().min(1).max(80)
});

export const getUserRecordings = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      fail(res, 401, 'Nicht angemeldet');
      return;
    }

    const qrCodes = await QRCode.find({ assignedTo: req.user.userId }).sort({ yearLabel: 1 }).lean();
    const qrIds = qrCodes.map((q) => q._id);
    const audios = await AudioMemory.find({ qrCodeId: { $in: qrIds } }).lean();
    const byQr = new Map<string, (typeof audios)[number]>();
    audios.forEach((a) => byQr.set(String(a.qrCodeId), a));

    const slots = qrCodes.map((q) => {
      const audio = byQr.get(String(q._id));
      return {
        qrCode: q.code,
        yearLabel: q.yearLabel ?? null,
        hasAudio: Boolean(audio),
        audio: audio
          ? {
            title: audio.title ?? null,
            durationSeconds: audio.durationSeconds ?? null,
            uploadedAt: audio.createdAt
          }
          : null
      };
    });

    ok(res, { totalSlots: 18, recorded: slots.filter((s) => s.hasAudio).length, slots });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      fail(res, 401, 'Nicht angemeldet');
      return;
    }

    const { childName } = updateProfileSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(req.user.userId, { childName }, { new: true }).lean();
    if (!user) {
      fail(res, 404, 'Benutzer nicht gefunden');
      return;
    }
    ok(res, { childName: user.childName });
  } catch (err) {
    next(err);
  }
};
