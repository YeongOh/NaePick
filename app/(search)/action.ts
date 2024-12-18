'use server';

import { SQL, sql } from 'drizzle-orm';

import { db } from '@/app/lib/database';
import {
  candidates,
  categories,
  matchResults,
  mediaTypes,
  users,
  worldcups,
} from '@/app/lib/database/schema';

import { PopularNextCursor, TCard } from '../lib/types';

export async function getWorldcups({
  sort,
  category,
  cursor,
  query,
}: {
  sort?: 'latest' | 'popular';
  category?: string;
  cursor: string | PopularNextCursor | null;
  query?: string;
}) {
  if (
    sort === 'popular' &&
    (cursor === null || (typeof cursor === 'object' && 'matchCount' in cursor && 'createdAt' in cursor))
  ) {
    return await getPopularWorldcups({ category, cursor, query });
  } else if (sort === 'latest' && (cursor === null || typeof cursor === 'string')) {
    return await getLatestWorldcups({ category, cursor, query });
  } else {
    throw new Error('wrong query for worldcups');
  }
}

export async function getLatestWorldcups({
  category,
  cursor,
  query,
}: {
  category?: string;
  cursor: string | null;
  query?: string;
}) {
  const DATA_PER_PAGE = 15;

  const sqlChunks: SQL[] = [];
  sqlChunks.push(sql`WHERE ${worldcups.publicity} = 'public'`);

  if (cursor) sqlChunks.push(sql`AND ${worldcups.createdAt} < ${cursor}`);
  if (category) sqlChunks.push(sql`AND ${categories.name} = ${category}`);
  if (query) sqlChunks.push(sql`AND ${worldcups.title} LIKE ${query + '%'}`);

  const filter: SQL = sql.join(sqlChunks, sql.raw(' '));

  const [result, meta]: [unknown, any] = await db.execute(sql`
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
        ${filter}
        ORDER BY ${worldcups.createdAt} DESC
        LIMIT ${DATA_PER_PAGE}
        `);

  const nextCursor =
    Array.isArray(result) && result.length === DATA_PER_PAGE ? result.at(-1)?.createdAt : null;
  return { data: (result as TCard[]) || [], nextCursor };
}

export async function getPopularWorldcups({
  category,
  cursor,
  query,
}: {
  category?: string;
  cursor?: PopularNextCursor | null;
  query?: string;
}) {
  const DATA_PER_PAGE = 15;

  const sqlChunks: SQL[] = [];
  sqlChunks.push(sql`WHERE ${worldcups.publicity} = 'public'`);

  if (cursor)
    sqlChunks.push(sql`AND (COALESCE(m.match_count, 0) < ${cursor.matchCount} 
  OR (COALESCE(m.match_count, 0) = ${cursor.matchCount} AND ${worldcups.createdAt} < ${cursor.createdAt}))`);
  if (category) sqlChunks.push(sql`AND ${categories.name} = ${category}`);
  if (query) sqlChunks.push(sql`AND ${worldcups.title} LIKE ${query + '%'}`);

  const filter: SQL = sql.join(sqlChunks, sql.raw(' '));

  const [result, meta]: [unknown, any] = await db.execute(sql`
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
        ${filter}
        ORDER BY m.match_count DESC, ${worldcups.createdAt} DESC
        LIMIT ${DATA_PER_PAGE}
        `);

  const nextCursor =
    Array.isArray(result) && result.length === DATA_PER_PAGE
      ? { matchCount: result.at(-1)?.matchCount as number, createdAt: result.at(-1)?.createdAt as string }
      : null;
  return { data: result as TCard[], nextCursor };
}
