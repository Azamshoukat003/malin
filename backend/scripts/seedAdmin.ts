import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import AdminUser from '../src/models/AdminUser.model';
import User from '../src/models/User.model';

dotenv.config();

const seed = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI fehlt');

  await mongoose.connect(uri);
  const email = 'developer@gmail.com';
  const password = 'password123';
  const passwordHash = await bcrypt.hash(password, 12);

  await AdminUser.findOneAndUpdate({ email }, { email, passwordHash }, { upsert: true, new: true });
  await User.findOneAndUpdate(
    { email: 'thisemail@gmail.com' },
    {
      email: 'thisemail@gmail.com',
      childName: 'Testkind',
      magicLinkToken: null,
      magicLinkExpiry: null,
      magicLinkUsed: false
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Admin erstellt: ${email} / ${password}`);
  console.log('User erstellt: thisemail@gmail.com (Magic-Link Login, kein Passwort im aktuellen System)');
  process.exit(0);
};

seed().catch((err: Error) => {
  console.error(err.message);
  process.exit(1);
});
