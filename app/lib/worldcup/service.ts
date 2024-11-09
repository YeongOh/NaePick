'use server';
import { candidates, users, worldcups } from '../database/schema';
import { nanoid } from 'nanoid';
import { WORLDCUP_ID_LENGTH } from '@/app/constants';
import { db } from '../database';
import { asc, desc, eq, getTableColumns, gt, lt } from 'drizzle-orm';

export async function createWorldcup({
  title,
  description,
  publicity,
  categoryId,
  userId,
}: {
  title: string;
  description: string | null;
  publicity: 'public' | 'private' | 'unlisted';
  categoryId: number;
  userId: string;
}) {
  try {
    const worldcupId = nanoid(WORLDCUP_ID_LENGTH);
    await db.insert(worldcups).values({ id: worldcupId, title, description, publicity, userId, categoryId });
    return worldcupId;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateWorldcup({
  worldcupId,
  title,
  description,
  publicity,
  categoryId,
}: {
  worldcupId: string;
  title: string;
  description: string | null;
  publicity: 'public' | 'private' | 'unlisted';
  categoryId: number;
}) {
  try {
    await db
      .update(worldcups)
      .set({ title, description, publicity, categoryId })
      .where(eq(worldcups.id, worldcupId));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getWorldcupForm(worldcupId: string) {
  try {
    return await db
      .select({
        id: worldcups.id,
        title: worldcups.title,
        description: worldcups.description,
        publicity: worldcups.publicity,
        categoryId: worldcups.categoryId,
        userId: worldcups.userId,
      })
      .from(worldcups)
      .where(eq(worldcups.id, worldcupId));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getWorldcups(cursor?: string) {
  const DATA_PER_PAGE = 3;

  try {
    const result = await db
      .select()
      .from(worldcups)
      .where(cursor ? lt(worldcups.createdAt, cursor) : undefined)
      .limit(DATA_PER_PAGE)
      .orderBy(desc(worldcups.createdAt));

    const nextCursor = result.length ? result.at(-1)?.createdAt : undefined;
    return { data: result, nextCursor };
  } catch (error) {
    console.error(error);
  }
}

export async function getWorldcup(worldcupId: string) {
  try {
    const result = await db
      .select({
        ...getTableColumns(worldcups),
        nickname: users.nickname,
        profilePath: users.profilePath,
        candidatesCount: db.$count(candidates, eq(candidates.worldcupId, worldcupId)),
      })
      .from(worldcups)
      .leftJoin(users, eq(users.id, worldcups.userId))
      .where(eq(worldcups.id, worldcupId));

    return result;
  } catch (error) {
    console.error(error);
  }
}

// export async function deleteWorldcup(worldcupId: string) {
//   const session = await getSession();

//   try {
//     if (!session?.userId) {
//       throw new Error('로그인이 만료되었습니다.');
//     }

//     await validateWorldcupOwnership(worldcupId, session.userId);

//     // S3 이미지 삭제
//     // 1. 버킷 안의 모든 파일 조회
//     const worldcupKey = `worldcups/${worldcupId}`;
//     const imgObjects = await listAllS3ImgObjects(worldcupKey);
//     const deleteObjectPromises: Promise<void>[] = [];
//     if (imgObjects && imgObjects.length) {
//       // 버킷 안의 객체가 존재할 경우 모두 삭제 => 모든 객체가 삭제될경우 디렉토리도 사라짐
//       // S3에는 디렉토리의 개념이 없음
//       imgObjects.forEach(({ Key }) => deleteObjectPromises.push(deleteImage(Key as string)));
//     }
//     const videoObjects = await listAllS3VideoObjects(worldcupKey);
//     if (videoObjects && videoObjects.length) {
//       videoObjects.forEach(({ Key }) => deleteObjectPromises.push(deleteVideo(Key as string)));
//     }
//     const result = await Promise.all(deleteObjectPromises);

//     // ON DELETE CASCADE로 관련 있는 모든 로우 한번에 삭제
//     const [worldcupDeleteResult, meta] = await db.query(
//       `DELETE FROM worldcup
//           WHERE worldcup_id = ?`,
//       [worldcupId]
//     );
//   } catch (err) {
//     console.log(err);
//   }
//   revalidatePath(`/wc/users/${session.userId}`);
// }
