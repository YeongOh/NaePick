'use server';

import { revalidatePath } from 'next/cache';

import { validateWorldcupOwnership } from './auth';
import {
  deleteImgObject,
  deleteVideoObject,
  listAllS3ImgObjects,
  listAllS3VideoObjects,
} from '../storage';
import { getSession } from '../session';
import { pool } from '../database';

export async function deleteWorldcup(worldcupId: string) {
  const session = await getSession();

  try {
    if (!session?.userId) {
      throw new Error('로그인이 만료되었습니다.');
    }

    await validateWorldcupOwnership(worldcupId, session.userId);

    // S3 이미지 삭제
    // 1. 버킷 안의 모든 파일 조회
    const worldcupKey = `worldcups/${worldcupId}`;
    const imgObjects = await listAllS3ImgObjects(worldcupKey);
    const deleteObjectPromises: Promise<void>[] = [];
    if (imgObjects && imgObjects.length) {
      // 버킷 안의 객체가 존재할 경우 모두 삭제 => 모든 객체가 삭제될경우 디렉토리도 사라짐
      // S3에는 디렉토리의 개념이 없음
      imgObjects.forEach(({ Key }) =>
        deleteObjectPromises.push(deleteImgObject(Key as string))
      );
    }
    const videoObjects = await listAllS3VideoObjects(worldcupKey);
    if (videoObjects && videoObjects.length) {
      videoObjects.forEach(({ Key }) =>
        deleteObjectPromises.push(deleteVideoObject(Key as string))
      );
    }
    const result = await Promise.all(deleteObjectPromises);

    // ON DELETE CASCADE로 관련 있는 모든 로우 한번에 삭제
    const [worldcupDeleteResult, meta] = await pool.query(
      `DELETE FROM worldcup
          WHERE worldcup_id = ?`,
      [worldcupId]
    );
  } catch (err) {
    console.log(err);
  }
  revalidatePath(`/wc/users/${session.userId}`);
}
