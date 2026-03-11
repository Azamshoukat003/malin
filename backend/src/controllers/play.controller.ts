import type { NextFunction, Request, Response } from 'express';
import AudioMemory from '../models/AudioMemory.model';
import QRCode from '../models/QRCode.model';
import User from '../models/User.model';
import { generatePresignedDownloadUrl } from '../services/s3.service';
import { fail, ok } from '../utils/response';

export const getPlayableAudio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const code = req.params.code;
    const qr = await QRCode.findOne({ code, isActive: true }).lean();
    if (!qr) {
      fail(res, 404, 'Dieser QR-Code ist nicht gültig');
      return;
    }

    const audio = await AudioMemory.findOne({ qrCodeId: qr._id }).lean();
    if (!audio) {
      ok(res, null);
      return;
    }

    const url = await generatePresignedDownloadUrl(audio.s3Key);
    const user = qr.assignedTo ? await User.findById(qr.assignedTo).select('childName').lean() : null;
    ok(res, {
      code: qr.code,
      yearLabel: qr.yearLabel ?? null,
      childName: user?.childName ?? null,
      audio: {
        presignedUrl: url,
        fileName: audio.fileName,
        durationSeconds: audio.durationSeconds ?? null,
        title: audio.title ?? null,
        uploadedAt: audio.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};
