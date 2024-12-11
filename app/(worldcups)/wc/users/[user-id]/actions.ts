'use server';

import { eq, sql } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/app/lib/database';
import {
  candidates,
  categories,
  matchResults,
  mediaTypes,
  users,
  worldcups,
} from '@/app/lib/database/schema';
import { getSession } from '@/app/lib/session';
import { deleteImage, deleteVideo, listImageFiles, listVideoFiles } from '@/app/lib/storage';
import { TCard } from '@/app/lib/types';
import { verifyWorldcupOwner } from '@/app/lib/worldcup/auth';
import { deleteWorldcup } from '@/app/lib/worldcup/service';

export async function deleteWorldcupAction(worldcupId: string) {
  const session = await getSession();
  if (!session) throw new Error('세션이 만료되었습니다.');

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
  const DATA_PER_PAGE = 10;

  try {
    const [result, meta]: [unknown, any] = await db.execute(sql`
        SELECT ${worldcups.id}, ${worldcups.title}, ${worldcups.description},
               ${worldcups.publicity}, ${worldcups.createdAt} AS createdAt,
               ${users.nickname}, ${users.profilePath} AS profilePath,
               ${worldcups.publicity},
               lc.name AS leftName, lc.path AS leftPath, lc.thumbnail_url AS leftThumbnailUrl, lm.name as leftMediaType,
               rc.name AS rightName, rc.path AS rightPath, rc.thumbnail_url AS rightThumbnailUrl, rm.name as rightMediaType,
               ${categories.name} AS categoryName,
               COALESCE(m.match_count, 0) AS matchCount
        FROM ${worldcups}
        LEFT JOIN ${users} ON ${users.id} = ${worldcups.userId}
        LEFT JOIN ${categories} ON ${categories.id} = ${worldcups.categoryId}
        LEFT JOIN 
          (SELECT ${matchResults.worldcupId}, COUNT(${matchResults.worldcupId}) AS match_count FROM ${matchResults}
            GROUP BY ${matchResults.worldcupId}) AS m ON ${worldcups.id} = m.worldcup_id
        LEFT JOIN LATERAL (
          SELECT c.id, 
          COUNT(CASE WHEN ${matchResults.winnerId} = c.id THEN 1 END) /
          (COUNT(CASE WHEN ${matchResults.loserId} = c.id THEN 1 END) +
          COUNT(CASE WHEN ${matchResults.winnerId} = c.id THEN 1 END)) as win_rate
          FROM ${candidates} c
          LEFT JOIN ${matchResults} ON c.id IN (${matchResults.winnerId}, ${matchResults.loserId})
          WHERE ${matchResults.worldcupId} = ${worldcups.id}
          GROUP BY c.id
          ORDER BY win_rate DESC
          LIMIT 1
        ) AS lw ON TRUE
        LEFT JOIN ${candidates} AS lc ON lc.id = lw.id
        LEFT JOIN ${mediaTypes} AS lm ON lm.id = lc.media_type_id
        LEFT JOIN LATERAL (
          SELECT c.id, 
          COUNT(CASE WHEN ${matchResults.winnerId} = c.id THEN 1 END) /
          (COUNT(CASE WHEN ${matchResults.loserId} = c.id THEN 1 END) +
          COUNT(CASE WHEN ${matchResults.winnerId} = c.id THEN 1 END)) as win_rate
          FROM ${candidates} c
          LEFT JOIN ${matchResults} ON c.id IN (${matchResults.winnerId}, ${matchResults.loserId})
          WHERE ${matchResults.worldcupId} = ${worldcups.id} 
            AND c.id != lw.id
          GROUP BY c.id
          ORDER BY win_rate DESC
          LIMIT 1
        ) AS rw ON TRUE
        LEFT JOIN ${candidates} AS rc ON rc.id = rw.id
        LEFT JOIN ${mediaTypes} AS rm ON rm.id = rc.media_type_id
        WHERE ${worldcups.userId} = ${userId}
        ORDER BY ${worldcups.createdAt} DESC
        LIMIT ${DATA_PER_PAGE} OFFSET ${(page - 1) * DATA_PER_PAGE}
        `);

    const count = await db.$count(worldcups, eq(worldcups.userId, userId));

    return { data: result as TCard[], count };
  } catch (error) {
    console.error(error);
  }

  revalidateTag('worldcups');
}
