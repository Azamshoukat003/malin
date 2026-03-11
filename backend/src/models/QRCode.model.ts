import mongoose, { Document, Schema } from 'mongoose';

export interface IQRCode extends Document {
  code: string;
  publicUrl: string;
  assignedTo?: mongoose.Types.ObjectId | null;
  yearLabel?: number | null;
  isActive: boolean;
  batchId: string;
  createdAt: Date;
  updatedAt: Date;
}

const QRCodeSchema = new Schema<IQRCode>(
  {
    code: { type: String, required: true, unique: true, index: true },
    publicUrl: { type: String, required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    yearLabel: { type: Number, min: 1, max: 18, default: null },
    isActive: { type: Boolean, default: true },
    batchId: { type: String, required: true, index: true }
  },
  { timestamps: true }
);

export default mongoose.model<IQRCode>('QRCode', QRCodeSchema);
