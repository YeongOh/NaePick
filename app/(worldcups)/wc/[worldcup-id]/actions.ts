'use server';

import { COMMENT_TEXT_MAX_LENGTH } from '@/app/constants';
import { getCandidateName } from '@/app/lib/candidate/service';
import { verifyCommentOwner } from '@/app/lib/comment/auth';
import { createComment, deleteComment, updateComment } from '@/app/lib/comment/service';
import { db } from '@/app/lib/database';
import {
  candidates,
  categories,
  comments,
  games,
  mediaTypes,
  users,
  worldcups,
} from '@/app/lib/database/schema';
import { getSession } from '@/app/lib/session';
import { and, desc, eq, getTableColumns, lt, sql } from 'drizzle-orm';

export type CreateCommentState = {
  errors?: {
    text?: string[];
  };
  message?: string | null;
  newComment?: Comment | null;
};

export async function createCommentAction({
  text,
  worldcupId,
  votedCandidateId,
}: {
  worldcupId: string;
  text: string;
  votedCandidateId?: string;
}) {
  const trimText = text.trim();
  if (trimText.length === 0) return { errors: { text: ['댓글은 공백 제외 한 자 이상이어야합니다.'] } };
  if (trimText.length > COMMENT_TEXT_MAX_LENGTH)
    return {
      errors: { text: [`댓글은 ${COMMENT_TEXT_MAX_LENGTH} 이하여야합니다.`] },
    };

  const session = await getSession();
  const userId = session?.userId;

  const commentId = await createComment({
    worldcupId,
    userId,
    votedCandidateId,
    text: trimText,
  });

  let voted = null;
  if (votedCandidateId) {
    voted = await getCandidateName(votedCandidateId);
  }

  const newComment = {
    id: commentId,
    userId: userId ?? null,
    candidateId: votedCandidateId ?? null,
    isAnonymous: userId ? false : true,
    profilePath: session?.profilePath,
    nickname: session?.nickname,
    parentId: null,
    createdAt: String(new Date()),
    updatedAt: String(new Date()),
    worldcupId,
    text,
    voted,
  };
  return { data: newComment };
}

export async function getComments(worldcupId: string, cursor?: string) {
  const DATA_PER_PAGE = 10;

  try {
    const result = await db
      .select({
        ...getTableColumns(comments),
        nickname: users.nickname,
        profilePath: users.profilePath,
        voted: candidates.name,
      })
      .from(comments)
      .leftJoin(users, eq(users.id, comments.userId))
      .leftJoin(candidates, eq(candidates.id, comments.candidateId))
      .where(
        cursor
          ? and(eq(comments.worldcupId, worldcupId), lt(comments.createdAt, cursor))
          : eq(comments.worldcupId, worldcupId)
      )
      .limit(DATA_PER_PAGE)
      .orderBy(desc(comments.createdAt));

    const nextCursor = result.length ? result.at(-1)?.createdAt : undefined;
    return { data: result, nextCursor };
  } catch (error) {
    console.error(error);
  }
}

export async function getCommentsCount(worldcupId: string) {
  try {
    const count = await db.$count(comments, eq(comments.worldcupId, worldcupId));
    return count;
  } catch (error) {
    console.error(error);
  }
}

export async function updateCommentAction(commentId: string, text: string) {
  const session = await getSession();
  if (!session?.userId) throw new Error('로그인 세션이 만료되었습니다.');

  const userId = session.userId;
  const isVerified = verifyCommentOwner(commentId, userId);
  if (!isVerified) throw new Error('댓글을 삭제할 수 없습니다.');

  await updateComment(commentId, text);
}

export async function deleteCommentAction(commentId: string) {
  const session = await getSession();
  if (!session?.userId) throw new Error('로그인 세션이 만료되었습니다.');

  const userId = session.userId;
  const isVerified = verifyCommentOwner(commentId, userId);
  if (!isVerified) throw new Error('댓글을 삭제할 수 없습니다.');

  return await deleteComment(commentId);
}

export async function submitGameResult(
  gameResult: { winnerId: string; loserId: string }[],
  worldcupId: string
) {
  try {
    await db.transaction(async (tx) => {
      for (let i = 0; i < gameResult.length - 1; i++) {
        const { winnerId, loserId } = gameResult[i];
        await tx.insert(games).values({ worldcupId, winnerId, loserId });
      }

      const { winnerId: finalWinnerId, loserId: finalLoserId } = gameResult[gameResult.length - 1];
      await tx
        .insert(games)
        .values({ winnerId: finalWinnerId, loserId: finalLoserId, isFinalGame: true, worldcupId });
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getRandomCandidates(worldcupId: string, round: number) {
  try {
    const result = await db
      .select({ ...getTableColumns(candidates), mediaType: mediaTypes.name })
      .from(candidates)
      .innerJoin(mediaTypes, eq(mediaTypes.id, candidates.mediaTypeId))
      .where(eq(candidates.worldcupId, worldcupId))
      .orderBy(sql`rand()`)
      .limit(round);

    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function getWorldcups(sort: 'latest' | 'popular', cursor?: string, category?: string) {
  if (sort === 'latest') return await getLatestWorldcups(cursor, category);
  return getPopularWorldcups(cursor, category);
}

export async function getLatestWorldcups(cursor?: string, category?: string) {
  const DATA_PER_PAGE = 5;

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
      ${
        cursor
          ? sql`WHERE ${worldcups.publicity} = 'public' AND ${worldcups.createdAt} < ${cursor} AND ${categories.name} = ${category}`
          : sql`WHERE ${worldcups.publicity} = 'public' AND ${categories.name} = ${category}`
      }
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
  const DATA_PER_PAGE = 5;

  let filter = sql`WHERE ${worldcups.publicity} = 'public'`;

  if (cursor && category) {
    filter = sql`WHERE ${worldcups.publicity} = 'public' AND (COALESCE(g.game_count, 0) < ${cursor.gameCount}
             OR (COALESCE(g.game_count, 0) = ${cursor.gameCount} AND ${worldcups.createdAt} < ${cursor.createdAt}))
             AND ${categories.name} = ${category}`;
  } else if (cursor) {
    filter = sql`WHERE ${worldcups.publicity} = 'public' AND COALESCE(g.game_count, 0) < ${cursor.gameCount} 
             OR (COALESCE(g.game_count, 0) = ${cursor.gameCount} AND ${worldcups.createdAt} < ${cursor.createdAt})`;
  } else if (category) {
    filter = sql`WHERE ${worldcups.publicity} = 'public' AND ${categories.name} = ${category}`;
  }

  try {
    const [result] = await db.execute(sql`
      SELECT ${worldcups.id}, ${worldcups.title}, ${worldcups.description},
             ${worldcups.publicity}, ${worldcups.createdAt} AS createdAt,
             ${users.nickname}, ${users.profilePath} AS profilePath,
             lc.name AS leftName, lc.path AS leftPath, lc.thumbnail_url AS leftThumbnailUrl, lm.name as leftMediaType,
             rc.name AS rightName, rc.path AS rightPath, rc.thumbnail_url AS rightThumbnailUrl, rm.name as rightMediaType,
             ${categories.name} AS categoryName,
             COALESCE(g.game_count, 0) AS gameCount
      FROM ${worldcups}
      LEFT JOIN ${users} ON ${users.id} = ${worldcups.userId}
      LEFT JOIN ${categories} ON ${categories.id} = ${worldcups.categoryId}
      LEFT JOIN 
        (SELECT ${games.worldcupId}, COUNT(${games.worldcupId}) AS game_count FROM ${games}
	      GROUP BY ${games.worldcupId}) AS g ON ${worldcups.id} = g.worldcup_id
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
      ${filter}
      ORDER BY g.game_count DESC, ${worldcups.createdAt} DESC
      LIMIT ${DATA_PER_PAGE}
      `);

    const nextCursor =
      Array.isArray(result) && result.length
        ? { gameCount: result.at(-1)?.gameCount as number, createdAt: result.at(-1)?.createdAt as string }
        : null;
    return { data: result, nextCursor };
  } catch (error) {
    console.error(error);
  }
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
