'use server';
import { DeleteObjectCommand, ListObjectsCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { imageBucket, S3client, videoBucket } from './config';

export async function getSignedUrlForImage(key: string, fileType: string) {
  try {
    const params = {
      Bucket: imageBucket,
      Key: key,
      ContentType: fileType,
    };
    const command = new PutObjectCommand(params);
    const url = await getSignedUrl(S3client, command, {
      expiresIn: 300, // 5분
    });

    return url;
  } catch (error) {
    console.log(error);
  }
}

export async function listImageFiles(key: string) {
  try {
    const params = {
      Bucket: imageBucket,
      Prefix: key,
    };
    const command = new ListObjectsCommand(params);
    const { Contents } = await S3client.send(command);
    return Contents;
  } catch (error) {
    console.log(error);
  }
}

export async function listVideoFiles(key: string) {
  try {
    const params = {
      Bucket: videoBucket,
      Prefix: key,
    };
    const command = new ListObjectsCommand(params);
    const { Contents } = await S3client.send(command);
    return Contents;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteImage(key: string) {
  try {
    await S3client.send(
      new DeleteObjectCommand({
        Bucket: imageBucket,
        Key: key,
      }),
    );
  } catch (error) {
    console.error(error);
  }
}
export async function deleteVideo(key: string) {
  try {
    await S3client.send(
      new DeleteObjectCommand({
        Bucket: videoBucket,
        Key: key,
      }),
    );
  } catch (error) {
    console.error(error);
  }
}
