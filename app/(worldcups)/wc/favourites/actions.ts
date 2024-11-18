'use server';

import { db } from '@/app/lib/database';
import {
  candidates,
  categories,
  matchResults,
  mediaTypes,
  users,
  worldcupFavourites,
  worldcups,
} from '@/app/lib/database/schema';
import { getSession } from '@/app/lib/session';
import { eq, sql } from 'drizzle-orm';

export async function getMyWorldcupFavourites(page: number) {
  const session = await getSession();
  const userId = session?.userId;
  if (!userId) throw new Error('세션이 만료되었습니다.');

  const DATA_PER_PAGE = 20;

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
        INNER JOIN ${worldcupFavourites} ON ${worldcupFavourites.userId} = ${userId} 
                                         AND ${worldcupFavourites.worldcupId} = ${worldcups.id}
        LEFT JOIN ${users} ON ${users.id} = ${worldcups.userId}
        LEFT JOIN ${categories} ON ${categories.id} = ${worldcups.categoryId}
        LEFT JOIN LATERAL (
          SELECT ${matchResults.winnerId} AS id
          FROM ${matchResults}
          WHERE ${matchResults.worldcupId} = ${worldcups.id}
          GROUP BY ${matchResults.winnerId}
          ORDER BY COUNT(*) DESC
          LIMIT 1) AS lw ON TRUE
        LEFT JOIN ${candidates} AS lc ON lc.id = lw.id
        LEFT JOIN ${mediaTypes} AS lm ON lm.id = lc.media_type_id
        LEFT JOIN LATERAL (
          SELECT ${matchResults.winnerId} AS id
          FROM ${matchResults}
          WHERE ${matchResults.worldcupId} = ${worldcups.id}
          GROUP BY ${matchResults.winnerId}
          ORDER BY COUNT(*) DESC
          LIMIT 1 OFFSET 1) AS rw ON TRUE
        LEFT JOIN ${candidates} AS rc ON rc.id = rw.id
        LEFT JOIN ${mediaTypes} AS rm ON rm.id = rc.media_type_id
        WHERE ${worldcups.userId} = ${userId}
        ORDER BY ${worldcups.createdAt} DESC
        LIMIT ${DATA_PER_PAGE} OFFSET ${(page - 1) * DATA_PER_PAGE}
        `);

    const count = await db.$count(worldcupFavourites, eq(worldcupFavourites.userId, userId));

    return { data: result as any, count };
  } catch (error) {
    console.error(error);
  }
}
