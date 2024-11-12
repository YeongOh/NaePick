'use server';

import { db } from '@/app/lib/database';
import {
  candidates,
  categories,
  matchResults,
  mediaTypes,
  users,
  worldcups,
} from '@/app/lib/database/schema';
import { sql } from 'drizzle-orm';

export async function getWorldcups(sort: 'latest' | 'popular', cursor?: string, category?: string) {
  if (sort === 'latest') return await getLatestWorldcups(cursor, category);
  return getPopularWorldcups(cursor, category);
}

export async function getLatestWorldcups(cursor?: string, category?: string) {
  const DATA_PER_PAGE = 20;

  let filter = sql``;

  if (cursor && category) {
    filter = sql`WHERE ${worldcups.publicity} = 'public' AND ${worldcups.createdAt} < ${cursor} AND ${categories.name} = ${category}`;
  } else if (cursor) {
    filter = sql`WHERE ${worldcups.publicity} = 'public' AND ${worldcups.createdAt} < ${cursor}`;
  } else if (category) {
    filter = sql`WHERE ${worldcups.publicity} = 'public' AND ${categories.name} = ${category}`;
  } else {
    filter = sql`WHERE ${worldcups.publicity} = 'public'`;
  }

  try {
    const [result] = await db.execute(sql`
        SELECT ${worldcups.id}, ${worldcups.title}, ${worldcups.description},
               ${worldcups.publicity}, ${worldcups.createdAt} AS createdAt,
               ${users.nickname}, ${users.profilePath} AS profilePath,
               lc.name AS leftName, lc.path AS leftPath, lc.thumbnail_url AS leftThumbnailUrl, lm.name as leftMediaType,
               rc.name AS rightName, rc.path AS rightPath, rc.thumbnail_url AS rightThumbnailUrl, rm.name as rightMediaType,
               ${categories.name} AS categoryName
        FROM ${worldcups}
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
        ${filter}
        ORDER BY ${worldcups.createdAt} DESC
        LIMIT ${DATA_PER_PAGE}
        `);

    const nextCursor = Array.isArray(result) && result.length ? result.at(-1)?.createdAt : null;
    return { data: result, nextCursor };
  } catch (error) {
    console.error(error);
  }
}

export async function getPopularWorldcups(cursor?: any, category?: string) {
  const DATA_PER_PAGE = 20;

  let filter = sql``;

  if (cursor && category) {
    filter = sql`WHERE ${worldcups.publicity} = 'public' AND (COALESCE(m.match_count, 0) < ${cursor.matchCount}
               OR (COALESCE(m.match_count, 0) = ${cursor.matchCount} AND ${worldcups.createdAt} < ${cursor.createdAt}))
               AND ${categories.name} = ${category}`;
  } else if (cursor) {
    filter = sql`WHERE ${worldcups.publicity} = 'public' AND COALESCE(m.match_count, 0) < ${cursor.matchCount} 
               OR (COALESCE(m.match_count, 0) = ${cursor.matchCount} AND ${worldcups.createdAt} < ${cursor.createdAt})`;
  } else if (category) {
    filter = sql`WHERE ${worldcups.publicity} = 'public' AND ${categories.name} = ${category}`;
  } else {
    filter = sql`WHERE ${worldcups.publicity} = 'public'`;
  }

  try {
    const [result] = await db.execute(sql`
        SELECT ${worldcups.id}, ${worldcups.title}, ${worldcups.description},
               ${worldcups.publicity}, ${worldcups.createdAt} AS createdAt,
               ${users.nickname}, ${users.profilePath} AS profilePath,
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
        ${filter}
        ORDER BY m.match_count DESC, ${worldcups.createdAt} DESC
        LIMIT ${DATA_PER_PAGE}
        `);

    const nextCursor =
      Array.isArray(result) && result.length
        ? { matchCount: result.at(-1)?.matchCount as number, createdAt: result.at(-1)?.createdAt as string }
        : null;
    return { data: result, nextCursor };
  } catch (error) {
    console.error(error);
  }
}
