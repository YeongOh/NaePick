'use server';

import { v4 as uuidv4 } from 'uuid';

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path';

const Bucket = process.env.AWS_S3_BUCKET;
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY as string,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
};
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials,
});

export async function fetchCandidateImageUploadURL(
  worldcupId: string,
  imagePath: string,
  fileType: string
) {
  const candidateId = uuidv4();
  const fileExtname = path.extname(imagePath);
  const key = `worldcups/${worldcupId}/${candidateId}${fileExtname}`;

  return {
    signedURL: await fetchImageUploadUrl(key, fileType),
    candidateURL: key,
    candidateId,
  };
}

export async function fetchUpdateCandidateImageUploadURL(
  worldcupId: string,
  candidateId: string,
  imagePath: string,
  fileType: string
) {
  const fileExtname = path.extname(imagePath);
  const key = `worldcups/${worldcupId}/${candidateId}${fileExtname}`;

  return {
    signedURL: await fetchImageUploadUrl(key, fileType),
    candidateURL: key,
  };
}

export async function fetchImageUploadUrl(key: string, fileType: string) {
  try {
    const params = {
      Bucket,
      Key: key,
      ContentType: fileType,
    };
    const command = new PutObjectCommand(params);
    const urlResult = await getSignedUrl(s3, command, { expiresIn: 6000 });
    console.log(urlResult);
    return urlResult;
  } catch (error) {
    console.log('s3 image upload url');
    throw new Error('S3 Image upload signedUrl fetch fail');
  }
}

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

export async function deleteS3Image(key: string) {
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket,
        Key: key,
      })
    );
  } catch (error) {
    console.log(error);
  }
}
