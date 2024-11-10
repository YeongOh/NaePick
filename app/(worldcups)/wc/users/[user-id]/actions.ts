'use server';

import { db } from '@/app/lib/database';
import { candidates, categories, games, mediaTypes, users, worldcups } from '@/app/lib/database/schema';
import { getSession } from '@/app/lib/session';
import { deleteImage, deleteVideo, listImageFiles, listVideoFiles } from '@/app/lib/storage';
import { verifyWorldcupOwner } from '@/app/lib/worldcup/auth';
import { deleteWorldcup } from '@/app/lib/worldcup/service';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function deleteWorldcupAction(worldcupId: string) {
  const session = await getSession();

  const userId = session.userId;
  const isVerified = verifyWorldcupOwner(worldcupId, userId);
  if (!isVerified) throw new Error('월드컵을 삭제할 수 없습니다.');

  try {
    const worldcupKey = `worldcups/${worldcupId}`;
    const imgObjects = await listImageFiles(worldcupKey);
    const deleteObjectPromises: Promise<void>[] = [];
    if (imgObjects && imgObjects.length)
      imgObjects.forEach(({ Key }) => deleteObjectPromises.push(deleteImage(Key as string)));

    const videoObjects = await listVideoFiles(worldcupKey);
    if (videoObjects && videoObjects.length)
      videoObjects.forEach(({ Key }) => deleteObjectPromises.push(deleteVideo(Key as string)));

    await Promise.all(deleteObjectPromises);
    await deleteWorldcup(worldcupId);
  } catch (err) {
    console.log(err);
  }
  revalidatePath(`/wc/users/${session.userId}`);
}

export async function getMyWorldcups(userId: string, page: number) {
  const DATA_PER_PAGE = 5;

  try {
    const [result] = await db.execute(sql`
        SELECT ${worldcups.id}, ${worldcups.title}, ${worldcups.description},
               ${worldcups.publicity}, ${worldcups.createdAt} AS createdAt,
               ${users.nickname}, ${users.profilePath} AS profilePath,
               ${worldcups.publicity},
               lc.name AS leftName, lc.path AS leftPath, lc.thumbnail_url AS leftThumbnailUrl, lm.name as leftMediaType,
               rc.name AS rightName, rc.path AS rightPath, rc.thumbnail_url AS rightThumbnailUrl, rm.name as rightMediaType,
               ${categories.name} AS categoryName
        FROM ${worldcups}
        LEFT JOIN ${users} ON ${users.id} = ${worldcups.userId}
        LEFT JOIN ${categories} ON ${categories.id} = ${worldcups.categoryId}
        LEFT JOIN LATERAL (
          SELECT ${games.winnerId} AS id
          FROM ${games}
          WHERE ${games.worldcupId} = ${worldcups.id}
          GROUP BY ${games.winnerId}
          ORDER BY COUNT(*) DESC
          LIMIT 1) AS lw ON TRUE
        LEFT JOIN ${candidates} AS lc ON lc.id = lw.id
        LEFT JOIN ${mediaTypes} AS lm ON lm.id = lc.media_type_id
        LEFT JOIN LATERAL (
          SELECT ${games.winnerId} AS id
          FROM ${games}
          WHERE ${games.worldcupId} = ${worldcups.id}
          GROUP BY ${games.winnerId}
          ORDER BY COUNT(*) DESC
          LIMIT 1 OFFSET 1) AS rw ON TRUE
        LEFT JOIN ${candidates} AS rc ON rc.id = rw.id
        LEFT JOIN ${mediaTypes} AS rm ON rm.id = rc.media_type_id
        WHERE ${worldcups.userId} = ${userId}
        ORDER BY ${worldcups.createdAt} DESC
        LIMIT ${DATA_PER_PAGE} OFFSET ${(page - 1) * DATA_PER_PAGE}
        `);

    const count = await db.$count(worldcups, eq(worldcups.userId, userId));

    return { data: result, count };
  } catch (error) {
    console.error(error);
  }
}
