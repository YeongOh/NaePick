'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '../session';
import { pool } from '../../db';
import { redirect } from 'next/navigation';
import { deleteObject, listAllS3Objects } from '../../images';

export async function deleteWorldcup(
  worldcupId: string,
  worldcupUserId: string
) {
  const session = await getSession();

  try {
    if (session.userId !== worldcupUserId) {
      redirect(`/forbidden`);
    }

    // S3 이미지 삭제
    // 1. 버킷 안의 모든 파일 조회
    const worldcupKey = `worldcups/${worldcupId}`;
    const contents = await listAllS3Objects(worldcupKey);
    const deleteObjectPromises: Promise<void>[] = [];
    if (contents && contents.length) {
      // 버킷 안의 객체가 존재할 경우 모두 삭제 => 모든 객체가 삭제될경우 디렉토리도 사라짐
      // S3에는 디렉토리의 개념이 없음
      contents.forEach(({ Key }) =>
        deleteObjectPromises.push(deleteObject(Key as string))
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
  revalidatePath(`/worldcups/users/${session.userId}`);
  redirect(`/worldcups/users/${session.userId}`);
}
