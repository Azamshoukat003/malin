import mongoose from 'mongoose';
import QRCode from './src/models/QRCode.model';
import { env } from './src/config/env';

async function run() {
    await mongoose.connect(env.MONGODB_URI);
    const codes = await QRCode.find().limit(5);
    console.log('Sample QR Codes:', codes.map(c => c.code));
    process.exit(0);
}
run();
