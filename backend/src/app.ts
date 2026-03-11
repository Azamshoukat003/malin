import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import playRoutes from './routes/play.routes';
import uploadRoutes from './routes/upload.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import { generalRateLimit } from './middleware/rateLimit.middleware';
import { errorHandler } from './middleware/error.middleware';
import { env } from './config/env';
import { connectDB } from './config/db';


const app = express();

// Ensure DB is connected for serverless environments
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
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

app.get('/health', (req, res) => {
  void req;
  res.json({ success: true, data: { status: 'ok' }, error: null });
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
