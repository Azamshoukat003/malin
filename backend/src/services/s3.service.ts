import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_BUCKET, s3Client } from '../config/s3';
import { env } from '../config/env';

const hasAWS = Boolean(env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY && env.AWS_REGION);

export const generatePresignedUploadUrl = async (s3Key: string, contentType: string): Promise<string> => {
  if (!hasAWS) {
    return 'mock-upload-url';
  }
  return getSignedUrl(
    s3Client,
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3Key,
      ContentType: contentType
    }),
    { expiresIn: 600 }
  );
};

export const generatePresignedDownloadUrl = async (s3Key: string): Promise<string> => {
  if (!hasAWS) {
    return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
  }
  return getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3Key
    }),
    { expiresIn: 900 }
  );
};

export const deleteS3Object = async (s3Key: string): Promise<void> => {
  if (!hasAWS) return;
  await s3Client.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: s3Key }));
};

export const checkS3ObjectExists = async (s3Key: string): Promise<boolean> => {
  if (!hasAWS) return true;
  try {
    await s3Client.send(new HeadObjectCommand({ Bucket: S3_BUCKET, Key: s3Key }));
    return true;
  } catch {
    return false;
  }
};

export const uploadBufferToS3 = async (s3Key: string, buffer: Buffer, contentType: string): Promise<void> => {
  if (!hasAWS) {
    console.log('[MOCK] Buffer upload successful for:', s3Key);
    return;
  }
  await s3Client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3Key,
      Body: buffer,
      ContentType: contentType
    })
  );
};
