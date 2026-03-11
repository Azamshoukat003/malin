import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash?: string | null;
  childName?: string | null;
  magicLinkToken?: string | null;
  magicLinkExpiry?: Date | null;
  magicLinkUsed: boolean;
  passwordResetOtpHash?: string | null;
  passwordResetOtpExpiry?: Date | null;
  passwordResetOtpAttempts: number;
  refreshTokenHash?: string | null;
  refreshTokenExpiry?: Date | null;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, default: null },
    childName: { type: String, default: null },
    magicLinkToken: { type: String, default: null, index: true },
    magicLinkExpiry: { type: Date, default: null },
    magicLinkUsed: { type: Boolean, default: false },
    passwordResetOtpHash: { type: String, default: null },
    passwordResetOtpExpiry: { type: Date, default: null },
    passwordResetOtpAttempts: { type: Number, default: 0, min: 0 },
    refreshTokenHash: { type: String, default: null },
    refreshTokenExpiry: { type: Date, default: null },
    lastLoginAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
