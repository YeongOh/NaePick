import { S3Client } from '@aws-sdk/client-s3';

export const imageBucket = process.env.AWS_S3_IMAGE_BUCKET;
export const videoBucket = process.env.AWS_S3_VIDEO_BUCKET;

export const S3credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY as string,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
};

export const S3client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: S3credentials,
});
