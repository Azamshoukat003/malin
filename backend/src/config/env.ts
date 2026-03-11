import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32).optional(),
  ACCESS_TOKEN_TTL_MINUTES: z.coerce.number().int().positive().default(15),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(30),
  AWS_ACCESS_KEY_ID: z.string().optional().or(z.literal('')),
  AWS_SECRET_ACCESS_KEY: z.string().optional().or(z.literal('')),
  AWS_REGION: z.string().optional().or(z.literal('')),
  AWS_S3_BUCKET: z.string().optional().or(z.literal('')),
  RESEND_API_KEY: z.string().min(1),
  FROM_EMAIL: z.string().email(),
  FRONTEND_URL: z.string().url()
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(parsed.error.format(), null, 2));
  throw new Error(`Invalid environment variables: ${parsed.error.message}`);
}

export const env = {
  ...parsed.data,
  JWT_REFRESH_SECRET: parsed.data.JWT_REFRESH_SECRET ?? parsed.data.JWT_SECRET
};
