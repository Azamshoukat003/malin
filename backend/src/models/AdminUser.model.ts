import mongoose, { Document, Schema } from 'mongoose';

export interface IAdminUser extends Document {
  email: string;
  passwordHash: string;
  passwordResetOtpHash?: string | null;
  passwordResetOtpExpiry?: Date | null;
  passwordResetOtpAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    passwordResetOtpHash: { type: String, default: null },
    passwordResetOtpExpiry: { type: Date, default: null },
    passwordResetOtpAttempts: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

export default mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);
