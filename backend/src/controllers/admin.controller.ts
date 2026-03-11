import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import QRCode from '../models/QRCode.model';
import User from '../models/User.model';
import AudioMemory from '../models/AudioMemory.model';
import { fail, ok } from '../utils/response';
import { generateQRBatch } from '../services/qr.service';
import { toCsv } from '../utils/csvExport';
import { deleteS3Object } from '../services/s3.service';
import { streamQrZip } from '../utils/zipExport';

export const generateQrSchema = z.object({
  count: z.number().int().min(1).max(5000),
  batchLabel: z.string().min(1).max(100)
});

export const listQrQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  batchId: z.string().optional(),
  status: z.enum(['assigned', 'unassigned']).optional()
});

export const getAdminStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    void req;
    const [totalQRCodes, totalUsers, totalRecordings, storage, recentUploads] = await Promise.all([
      QRCode.countDocuments({}),
      User.countDocuments({}),
      AudioMemory.countDocuments({}),
      AudioMemory.aggregate([{ $group: { _id: null, total: { $sum: '$fileSizeBytes' } } }]),
      AudioMemory.find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .populate<{ qrCodeId: { code: string }; userId: { email: string } }>('qrCodeId', 'code')
        .populate<{ qrCodeId: { code: string }; userId: { email: string } }>('userId', 'email')
        .lean()
    ]);

    ok(res, {
      totalQRCodes,
      totalUsers,
      totalRecordings,
      totalStorageMB: Number((((storage[0]?.total as number | undefined) ?? 0) / 1024 / 1024).toFixed(2)),
      recentUploads: recentUploads.map((r) => ({
        code: r.qrCodeId?.code ?? '',
        email: r.userId?.email ?? '',
        uploadedAt: r.createdAt
      }))
    });
  } catch (err) {
    next(err);
  }
};

export const generateQrBatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payload = generateQrSchema.parse(req.body);
    const created = await generateQRBatch(payload.count, payload.batchLabel);
    ok(res, { batchId: created.batchId, count: payload.count, codes: created.codes });
  } catch (err) {
    next(err);
  }
};

export const exportQrCsv = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const batchId = typeof req.query.batchId === 'string' ? req.query.batchId : undefined;
    const filter = batchId ? { batchId } : {};
    const rows = await QRCode.find(filter).sort({ createdAt: -1 }).lean();
    const csv = toCsv(
      rows.map((r) => ({
        code: r.code,
        publicUrl: r.publicUrl,
        batchId: r.batchId,
        isActive: r.isActive,
        assignedTo: r.assignedTo ? String(r.assignedTo) : '',
        createdAt: r.createdAt.toISOString()
      }))
    );

    const fileName = batchId ? `qr-codes-${batchId}.csv` : 'qr-codes.csv';
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

export const exportQrZip = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const batchId = typeof req.query.batchId === 'string' ? req.query.batchId : undefined;
    const code = typeof req.query.code === 'string' ? req.query.code : undefined;

    const filter: any = {};
    if (batchId) filter.batchId = batchId;
    if (code) filter.code = code;

    const rows = await QRCode.find(filter).sort({ createdAt: 1 });

    if (rows.length === 0) {
      fail(res, 404, 'Keine Sticker gefunden');
      return;
    }

    const archiveLabel = code || batchId || 'export';
    await streamQrZip(res, rows, archiveLabel);
  } catch (err) {
    next(err);
  }
};

export const listQrCodes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, batchId, status } = listQrQuerySchema.parse(req.query);
    const filter: Record<string, unknown> = {};
    if (batchId) filter.batchId = batchId;
    if (status === 'assigned') filter.assignedTo = { $ne: null };
    if (status === 'unassigned') filter.assignedTo = null;

    const skip = (page - 1) * limit;
    const [codes, total] = await Promise.all([
      QRCode.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('assignedTo', 'email').lean(),
      QRCode.countDocuments(filter)
    ]);

    ok(res, { codes, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

export const deleteQrCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const code = req.params.code;
    const qr = await QRCode.findOne({ code });
    if (!qr) {
      fail(res, 404, 'QR-Code nicht gefunden');
      return;
    }

    const memory = await AudioMemory.findOne({ qrCodeId: qr._id });
    if (memory) {
      await deleteS3Object(memory.s3Key);
      await memory.deleteOne();
    }
    await qr.deleteOne();
    ok(res, { deleted: true });
  } catch (err) {
    next(err);
  }
};
