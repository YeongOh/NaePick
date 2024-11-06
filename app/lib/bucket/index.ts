'use server';

import {
  DeleteObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path';
import { getSession } from '../actions/session';
import { validateWorldcupOwnership } from '../actions/auth/worldcup-ownership';
import { nanoid } from 'nanoid';
import { OBJECT_ID_LENGTH, USER_ID_LENGTH } from '../../constants';
import { MediaType } from '../definitions';
import { mp4toJpg } from '../../utils/utils';
import { ImageBucket, S3client, videoBucket } from './config';
import { pool } from '../db';

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
      signedURL: await fetchImageUploadURL(key, fileType),
      candidatePathname: key,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function fetchProfileImageUploadURL(
  imagePath: string,
  fileType: string
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      throw new Error('로그인을 해주세요.');
    }

    const objectId = nanoid(USER_ID_LENGTH);
    const key = `profile/${objectId}${path.extname(imagePath)}`;

    return {
      signedURL: await fetchImageUploadURL(key, fileType),
      profilePathname: key,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function fetchImageUploadURL(key: string, fileType: string) {
  try {
    const params = {
      Bucket: ImageBucket,
      Key: key,
      ContentType: fileType,
    };
    const command = new PutObjectCommand(params);
    const urlResult = await getSignedUrl(S3client, command, {
      expiresIn: 300, // 5분
    });

    return urlResult;
  } catch (error) {
    console.log(error);
  }
}

export async function listAllS3ImgObjects(key: string) {
  try {
    const params = {
      Bucket: ImageBucket,
      Prefix: key,
    };
    const command = new ListObjectsCommand(params);
    const { Contents } = await S3client.send(command);
    return Contents;
  } catch (error) {
    console.log(error);
  }
}

export async function listAllS3VideoObjects(key: string) {
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

export async function deleteCandidateObject(
  candidatePathname: string,
  worldcupId: string,
  mediaType: MediaType
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      throw new Error('로그인을 해주세요.');
    }
    await validateWorldcupOwnership(worldcupId, session.userId);

    if (mediaType === 'cdn_img') {
      await S3client.send(
        new DeleteObjectCommand({
          Bucket: ImageBucket,
          Key: candidatePathname,
        })
      );
    } else if (mediaType === 'cdn_video') {
      await S3client.send(
        new DeleteObjectCommand({
          Bucket: videoBucket,
          Key: candidatePathname,
        })
      );
      await S3client.send(
        new DeleteObjectCommand({
          Bucket: ImageBucket,
          Key: mp4toJpg(candidatePathname),
        })
      );
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deleteProfileImage(
  userId: string,
  deleteProfilePathname: string
) {
  try {
    const [result, meta] = await pool.query(
      `SELECT profile_pathname as profilePathname FROM user where user_id = ?`,
      [userId]
    );
    if (!result[0]) {
      throw new Error('존재하지 않는 아이디');
    }
    const { profilePathname } = result[0];
    console.log(deleteProfilePathname);
    console.log(profilePathname);
    if (deleteProfilePathname !== profilePathname) {
      throw new Error('잘못된 프로필 이미지 삭제 요청');
    }
    await S3client.send(
      new DeleteObjectCommand({
        Bucket: ImageBucket,
        Key: deleteProfilePathname,
      })
    );
  } catch (error) {
    console.log(error);
  }
}

export async function deleteImgObject(key: string) {
  try {
    await S3client.send(
      new DeleteObjectCommand({
        Bucket: ImageBucket,
        Key: key,
      })
    );
  } catch (error) {
    console.log(error);
  }
}
export async function deleteVideoObject(key: string) {
  try {
    await S3client.send(
      new DeleteObjectCommand({
        Bucket: videoBucket,
        Key: key,
      })
    );
  } catch (error) {
    console.log(error);
  }
}
