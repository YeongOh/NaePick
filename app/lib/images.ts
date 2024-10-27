'use server';

import {
  DeleteObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path';
import { getSession } from './actions/session';
import { validateWorldcupOwnership } from './actions/auth/worldcup-ownership';
import { nanoid } from 'nanoid';
import { OBJECT_ID_LENGTH } from '../constants';

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
  try {
    const session = await getSession();
    if (!session?.userId) {
      throw new Error('로그인을 해주세요.');
    }
    await validateWorldcupOwnership(worldcupId, session.userId);

    const objectId = nanoid(OBJECT_ID_LENGTH);
    const key = `worldcups/${worldcupId}/${objectId}${path.extname(imagePath)}`;

    return {
      signedURL: await fetchImageUploadUrl(key, fileType),
      candidatePathname: key,
    };
  } catch (error) {
    console.log(error);
    throw new Error('이미지 업로드 실패...');
  }
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

    return urlResult;
  } catch (error) {
    console.log('s3 image upload url');
    throw new Error('S3 Image upload signedUrl fetch fail');
  }
}

export async function listAllS3Objects(key: string) {
  try {
    const params = {
      Bucket,
      Prefix: key,
    };
    const command = new ListObjectsCommand(params);
    const { Contents } = await s3.send(command);
    return Contents;
  } catch (error) {
    console.log('s3 image upload url');
    throw new Error('S3 Image upload signedUrl fetch fail');
  }
}

async function uploadFile(file: File, fileName: string) {
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

export async function deleteCandidateObject(
  candidatePathname: string,
  worldcupId: string
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      throw new Error('로그인을 해주세요.');
    }
    await validateWorldcupOwnership(worldcupId, session.userId);

    await s3.send(
      new DeleteObjectCommand({
        Bucket,
        Key: candidatePathname,
      })
    );
  } catch (error) {
    console.log(error);
    throw new Error('이미지 삭제 실패...');
  }
}

export async function deleteObject(key: string) {
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
