import { S3Client } from '@aws-sdk/client-s3';
import { env } from './env';

const s3Config: any = {
  region: env.AWS_REGION || 'us-east-1'
};

if (env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY) {
  s3Config.credentials = {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY
  };
}

export const s3Client = new S3Client(s3Config);

export const S3_BUCKET = env.AWS_S3_BUCKET;
