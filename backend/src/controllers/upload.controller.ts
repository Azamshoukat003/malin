import type { NextFunction, Response } from 'express';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import QRCode from '../models/QRCode.model';
import AudioMemory from '../models/AudioMemory.model';
import type { AuthRequest } from '../types/express';
import { checkS3ObjectExists, deleteS3Object, generatePresignedUploadUrl, uploadBufferToS3 } from '../services/s3.service';
import { fail, ok } from '../utils/response';

const allowedMimeTypes = [
  'audio/mpeg',
  'audio/mp4',
  'audio/wav',
  'audio/ogg',
  'audio/x-m4a'
] as const;

export const presignSchema = z.object({
  qrCode: z.string().min(3),
  fileName: z.string().min(1),
  fileType: z.enum(allowedMimeTypes),
  fileSizeBytes: z.number().int().positive().max(104857600)
});

export const confirmSchema = z.object({
  qrCode: z.string().min(3),
  s3Key: z.string().min(1),
  fileName: z.string().min(1),
  fileSizeBytes: z.number().int().positive().max(104857600),
  durationSeconds: z.number().nonnegative().nullable().optional(),
  mimeType: z.enum(allowedMimeTypes),
  title: z.string().max(120).nullable().optional()
});

const extFromMime = (mime: string): string => {
  if (mime === 'audio/mpeg') return 'mp3';
  if (mime === 'audio/mp4' || mime === 'audio/x-m4a') return 'm4a';
  if (mime === 'audio/wav') return 'wav';
  return 'ogg';
};

export const presignUpload = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      fail(res, 401, 'Nicht angemeldet');
      return;
    }

    const payload = presignSchema.parse(req.body);
    const qr = await QRCode.findOne({ code: payload.qrCode, isActive: true });
    if (!qr) {
      fail(res, 404, 'Dieser QR-Code ist nicht gültig');
      return;
    }
    if (qr.assignedTo && String(qr.assignedTo) !== req.user.userId) {
      fail(res, 403, 'QR-Code gehört einem anderen Benutzer');
      return;
    }

    const s3Key = `recordings/${req.user.userId}/${payload.qrCode}/${randomUUID()}.${extFromMime(payload.fileType)}`;
    const presignedUrl = await generatePresignedUploadUrl(s3Key, payload.fileType);
    ok(res, { presignedUrl, s3Key });
  } catch (err) {
    next(err);
  }
};

export const confirmUpload = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      fail(res, 401, 'Nicht angemeldet');
      return;
    }
    const payload = confirmSchema.parse(req.body);
    const qr = await QRCode.findOne({ code: payload.qrCode, isActive: true });
    if (!qr) {
      fail(res, 404, 'Dieser QR-Code ist nicht gültig');
      return;
    }
    if (qr.assignedTo && String(qr.assignedTo) !== req.user.userId) {
      fail(res, 403, 'QR-Code gehört einem anderen Benutzer');
      return;
    }

    const exists = await checkS3ObjectExists(payload.s3Key);
    if (!exists) {
      fail(res, 400, 'Datei nicht in S3 gefunden');
      return;
    }

    if (!qr.assignedTo) {
      qr.assignedTo = new mongoose.Types.ObjectId(req.user.userId);
      await qr.save();
    }

    const existing = await AudioMemory.findOne({ qrCodeId: qr._id, userId: req.user.userId });
    if (existing) {
      await deleteS3Object(existing.s3Key);
      await existing.deleteOne();
    }

    const created = await AudioMemory.create({
      qrCodeId: qr._id,
      userId: req.user.userId,
      s3Key: payload.s3Key,
      fileName: payload.fileName,
      fileSizeBytes: payload.fileSizeBytes,
      durationSeconds: payload.durationSeconds ?? null,
      mimeType: payload.mimeType,
      title: payload.title ?? null
    });

    ok(res, { audioId: String(created._id) });
  } catch (err) {
    next(err);
  }
};

export const deleteUpload = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      fail(res, 401, 'Nicht angemeldet');
      return;
    }
    const qr = await QRCode.findOne({ code: req.params.code, assignedTo: req.user.userId });
    if (!qr) {
      fail(res, 403, 'Kein Zugriff');
      return;
    }

    const memory = await AudioMemory.findOne({ qrCodeId: qr._id, userId: req.user.userId });
    if (!memory) {
      fail(res, 404, 'Erinnerung nicht gefunden');
      return;
    }

    await deleteS3Object(memory.s3Key);
    await memory.deleteOne();
    ok(res, { deleted: true });
  } catch (err) {
    next(err);
  }
};

export const directUpload = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      fail(res, 401, 'Nicht angemeldet');
      return;
    }
    if (!req.file) {
      fail(res, 400, 'Keine Datei hochgeladen');
      return;
    }

    const { qrCode } = z.object({ qrCode: z.string() }).parse(req.body);
    const qr = await QRCode.findOne({ code: qrCode, isActive: true });
    if (!qr) {
      fail(res, 404, 'Dieser QR-Code ist nicht gültig');
      return;
    }

    if (qr.assignedTo && String(qr.assignedTo) !== req.user.userId) {
      fail(res, 403, 'QR-Code gehört einem anderen Benutzer');
      return;
    }

    const s3Key = `recordings/${req.user.userId}/${qrCode}/${randomUUID()}.${extFromMime(req.file.mimetype)}`;

    // Upload directly to S3 from backend
    await uploadBufferToS3(s3Key, req.file.buffer, req.file.mimetype);

    if (!qr.assignedTo) {
      qr.assignedTo = new mongoose.Types.ObjectId(req.user.userId);
      await qr.save();
    }

    const existing = await AudioMemory.findOne({ qrCodeId: qr._id, userId: req.user.userId });
    if (existing) {
      await deleteS3Object(existing.s3Key);
      await existing.deleteOne();
    }

    const created = await AudioMemory.create({
      qrCodeId: qr._id,
      userId: req.user.userId,
      s3Key,
      fileName: req.file.originalname,
      fileSizeBytes: req.file.size,
      durationSeconds: parseInt(req.body.durationSeconds) || null,
      mimeType: req.file.mimetype,
      title: req.file.originalname.replace(/\.[^/.]+$/, '')
    });

    ok(res, { audioId: String(created._id) });
  } catch (err) {
    next(err);
  }
};
