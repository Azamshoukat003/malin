import { nanoid } from 'nanoid';
import QRCodeModel, { IQRCode } from '../models/QRCode.model';

const CHUNK_SIZE = 500;

interface GeneratedCode {
  code: string;
  publicUrl: string;
}

export const generateQRBatch = async (
  count: number,
  batchLabel: string
): Promise<{ batchId: string; codes: GeneratedCode[] }> => {
  const batchId = `${batchLabel.trim().replace(/\s+/g, '_')}_${Date.now()}`;
  const year = new Date().getFullYear();
  const docs: Array<Pick<IQRCode, 'code' | 'publicUrl' | 'batchId' | 'isActive'>> = [];
  const emittedCodes = new Set<string>();

  while (docs.length < count) {
    const code = `MK-${year}-${nanoid(6).toUpperCase()}`;
    if (emittedCodes.has(code)) continue;
    emittedCodes.add(code);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    docs.push({
      code,
      publicUrl: `${frontendUrl}/play/${code}`,
      batchId,
      isActive: true
    });
  }

  for (let i = 0; i < docs.length; i += CHUNK_SIZE) {
    const chunk = docs.slice(i, i + CHUNK_SIZE);
    await QRCodeModel.insertMany(chunk, { ordered: false });
  }

  return {
    batchId,
    codes: docs.map((d) => ({ code: d.code, publicUrl: d.publicUrl }))
  };
};
