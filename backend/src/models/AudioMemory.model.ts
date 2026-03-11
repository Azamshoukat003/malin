import mongoose, { Document, Schema } from 'mongoose';

export interface IAudioMemory extends Document {
  qrCodeId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  s3Key: string;
  fileName: string;
  fileSizeBytes: number;
  durationSeconds?: number | null;
  mimeType: string;
  title?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const AudioMemorySchema = new Schema<IAudioMemory>(
  {
    qrCodeId: { type: Schema.Types.ObjectId, ref: 'QRCode', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    s3Key: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSizeBytes: { type: Number, required: true },
    durationSeconds: { type: Number, default: null },
    mimeType: { type: String, required: true },
    title: { type: String, default: null }
  },
  { timestamps: true }
);

export default mongoose.model<IAudioMemory>('AudioMemory', AudioMemorySchema);
