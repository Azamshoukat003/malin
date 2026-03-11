import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from '../src/routes/auth.routes';
import playRoutes from '../src/routes/play.routes';
import uploadRoutes from '../src/routes/upload.routes';
import userRoutes from '../src/routes/user.routes';
import adminRoutes from '../src/routes/admin.routes';
import { generalRateLimit } from '../src/middleware/rateLimit.middleware';
import { errorHandler } from '../src/middleware/error.middleware';
import { env } from '../src/config/env';
import { connectDB } from '../src/config/db';


console.log('>>> VERCEL API HANDLER LOADING...');
const app = express();

// DEBUG LOG FOR VERCEL
console.log('>>> Backend Function Initialized');

// Ensure DB is connected for serverless environments
app.use(async (req, _res, next) => {
  console.log(`[DEBUG] Incoming Request: ${req.method} ${req.url}`);
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[CRITICAL] DB Connection Failed:', err);
    next(err);
  }
});

app.use(helmet());
app.use(
  cors({
    origin: [
      env.FRONTEND_URL, 
      'http://localhost:3000',
      'http://localhost:3002', 
      'https://malin-front.vercel.app', 
      'https://malin1.vercel.app'
    ],
    credentials: true
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(morgan('combined'));
app.use(generalRateLimit);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MalinKiddy Backend API is running',
    healthCheck: '/health'
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      env: process.env.NODE_ENV
    },
    error: null
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/play', playRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

app.use('*', (req, res) => {
  void req;
  res.status(404).json({ success: false, data: null, error: 'Route nicht gefunden' });
});

app.use(errorHandler);

export default app;
