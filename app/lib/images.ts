import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

const Bucket = process.env.AWS_S3_BUCKET;
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function uploadFile(file: File, fileName: string) {
  const Body = (await file.arrayBuffer()) as Buffer;

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket,
        Key: fileName,
        Body,
      })
    );
  } catch (error) {
    console.log(error);
  }
}

export const BASE_IMAGE_URL = 'https://cdn.naepick.co.kr/';

export async function deleteImage(candidateId: string) {
  try {
    // S3 삭제에 사용되는 key에는 path도 포함됨
    console.log(`deleteing ${candidateId}`);
    await s3.send(
      new DeleteObjectCommand({
        Bucket,
        Key: candidateId,
      })
    );
  } catch (error) {
    console.log(error);
  }
}
