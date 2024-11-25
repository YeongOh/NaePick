'use server';

import { and, asc, count, desc, eq, getTableColumns, isNull, lt, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/mysql-core';

import { verifyCommentOwner } from '@/app/lib/comment/auth';
import {
  cancelLikeComment,
  createComment,
  deleteComment,
  likeComment,
  replyComment,
  updateComment,
} from '@/app/lib/comment/service';
import { db } from '@/app/lib/database';
import {
  candidates,
  commentLikes,
  comments,
  matchResults,
  mediaTypes,
  users,
  worldcupFavourites,
  worldcupLikes,
} from '@/app/lib/database/schema';
import { getSession } from '@/app/lib/session';
import {
  addWorldcupFavourite,
  likeWorldcup,
  removeWorldcupFavourite,
  unlikeWorldcup,
} from '@/app/lib/worldcup/service';
import { CommentFormSchema, TCommentFormSchema } from './types';

export async function createCommentAction({
  data,
  worldcupId,
  votedCandidateId,
}: {
  worldcupId: string;
  data: TCommentFormSchema;
  votedCandidateId?: string;
}) {
  const validatedFields = CommentFormSchema.safeParse(data);
  if (!validatedFields.success) {
    let parseError = {};
    validatedFields.error.issues.forEach((issue) => {
      parseError = { ...parseError, [issue.path[0]]: issue.message };
    });
    return {
      errors: parseError,
    };
  }

  const session = await getSession();
  const userId = session?.userId;
  if (!userId)
    return {
      errors: {
        session: '로그인 세션이 만료되었습니다.',
      },
    };

  const trimText = data.text.trim();
  await createComment({
    worldcupId,
    userId,
    votedCandidateId,
    text: trimText,
  });
}

export async function replyCommentAction({
  parentId,
  data,
  worldcupId,
  votedCandidateId,
}: {
  parentId: string;
  worldcupId: string;
  data: TCommentFormSchema;
  votedCandidateId?: string;
}) {
  const validatedFields = CommentFormSchema.safeParse(data);
  if (!validatedFields.success) {
    let parseError = {};
    validatedFields.error.issues.forEach((issue) => {
      parseError = { ...parseError, [issue.path[0]]: issue.message };
    });
    return {
      errors: parseError,
    };
  }

  const session = await getSession();
  const userId = session?.userId;
  if (!userId)
    return {
      errors: {
        session: '로그인 세션이 만료되었습니다.',
      },
    };

  const trimText = data.text.trim();
  await replyComment({
    parentId,
    worldcupId,
    userId,
    votedCandidateId,
    text: trimText,
  });
}

export async function getComments(worldcupId: string, userId?: string, cursor?: string) {
  if (userId) return getCommentsWithUserId(worldcupId, userId, cursor);
  return getCommentsWithoutUserId(worldcupId, cursor);
}

export async function getCommentsWithUserId(worldcupId: string, userId: string, cursor?: string) {
  const DATA_PER_PAGE = 20;

  const replies = alias(comments, 'replies');

  const result = await db
    .select({
      ...getTableColumns(comments),
      nickname: users.nickname,
      profilePath: users.profilePath,
      voted: candidates.name,
      isLiked: commentLikes.userId,
      likeCount: db.$count(commentLikes, eq(commentLikes.commentId, comments.id)),
      replyCount: count(replies.id).as('replyCount'),
    })
    .from(comments)
    .leftJoin(replies, eq(replies.parentId, comments.id))
    .leftJoin(commentLikes, and(eq(commentLikes.commentId, comments.id), eq(commentLikes.userId, userId)))
    .leftJoin(users, eq(users.id, comments.userId))
    .leftJoin(candidates, eq(candidates.id, comments.candidateId))
    .where(
      cursor
        ? and(
            and(eq(comments.worldcupId, worldcupId), lt(comments.createdAt, cursor)),
            isNull(comments.parentId),
          )
        : and(eq(comments.worldcupId, worldcupId), isNull(comments.parentId)),
    )
    .groupBy(comments.id)
    .orderBy(desc(comments.createdAt))
    .limit(DATA_PER_PAGE);

  const nextCursor = result.length ? result.at(-1)?.createdAt : undefined;
  return { data: result, nextCursor };
}

export async function getCommentsWithoutUserId(worldcupId: string, cursor?: string) {
  const DATA_PER_PAGE = 20;

  const replies = alias(comments, 'replies');

  const result = await db
    .select({
      ...getTableColumns(comments),
      nickname: users.nickname,
      profilePath: users.profilePath,
      voted: candidates.name,
      likeCount: db.$count(commentLikes, eq(commentLikes.commentId, comments.id)),
      replyCount: count(replies.id).as('replyCount'),
    })
    .from(comments)
    .leftJoin(replies, eq(replies.parentId, comments.id))
    .leftJoin(users, eq(users.id, comments.userId))
    .leftJoin(candidates, eq(candidates.id, comments.candidateId))
    .where(
      cursor
        ? and(
            and(eq(comments.worldcupId, worldcupId), lt(comments.createdAt, cursor)),
            isNull(comments.parentId),
          )
        : and(eq(comments.worldcupId, worldcupId), isNull(comments.parentId)),
    )
    .groupBy(comments.id)
    .orderBy(desc(comments.createdAt))
    .limit(DATA_PER_PAGE);

  const nextCursor = result.length ? result.at(-1)?.createdAt : undefined;
  return { data: result, nextCursor };
}

export async function getCommentReplies(parentId: string, userId?: string) {
  if (userId) return getCommentRepliesWithUserId(parentId, userId);
  return getCommentRepliesWithoutUserId(parentId);
}

export async function getCommentRepliesWithUserId(parentId: string, userId: string) {
  try {
    const result = await db
      .select({
        ...getTableColumns(comments),
        nickname: users.nickname,
        profilePath: users.profilePath,
        isLiked: commentLikes.userId,
        voted: candidates.name,
        likeCount: db.$count(commentLikes, eq(commentLikes.commentId, comments.id)),
      })
      .from(comments)
      .leftJoin(users, eq(users.id, comments.userId))
      .leftJoin(commentLikes, and(eq(commentLikes.commentId, comments.id), eq(commentLikes.userId, userId)))
      .leftJoin(candidates, eq(candidates.id, comments.candidateId))
      .where(eq(comments.parentId, parentId))
      .orderBy(asc(comments.createdAt));
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function getCommentRepliesWithoutUserId(parentId: string) {
  try {
    const result = await db
      .select({
        ...getTableColumns(comments),
        nickname: users.nickname,
        profilePath: users.profilePath,
        voted: candidates.name,
        likeCount: db.$count(commentLikes, eq(commentLikes.commentId, comments.id)),
      })
      .from(comments)
      .leftJoin(users, eq(users.id, comments.userId))
      .leftJoin(candidates, eq(candidates.id, comments.candidateId))
      .where(eq(comments.parentId, parentId))
      .orderBy(asc(comments.createdAt));
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function getCommentCount(worldcupId: string) {
  try {
    const count = await db.$count(comments, eq(comments.worldcupId, worldcupId));
    return count;
  } catch (error) {
    console.error(error);
  }
}

export async function updateCommentAction(commentId: string, data: TCommentFormSchema) {
  const session = await getSession();
  if (!session?.userId)
    return {
      errors: {
        session: '로그인 세션이 만료되었습니다.',
      },
    };

  const userId = session.userId;
  const isVerified = await verifyCommentOwner(commentId, userId);
  if (!isVerified)
    return {
      errors: {
        session: '로그인 세션이 만료되었습니다.',
      },
    };

  const validatedFields = CommentFormSchema.safeParse(data);
  if (!validatedFields.success) {
    let parseError = {};
    validatedFields.error.issues.forEach((issue) => {
      parseError = { ...parseError, [issue.path[0]]: issue.message };
    });
    return {
      errors: parseError,
    };
  }

  const trimText = data.text.trim();
  await updateComment(commentId, trimText);
}

export async function deleteCommentAction(commentId: string) {
  const session = await getSession();
  if (!session?.userId)
    return {
      errors: {
        session: '로그인 세션이 만료되었습니다.',
      },
    };

  const userId = session.userId;
  const isVerified = await verifyCommentOwner(commentId, userId);
  if (!isVerified)
    return {
      errors: {
        session: '로그인 세션이 만료되었습니다.',
      },
    };

  return await deleteComment(commentId);
}

export async function likeCommentAction(commentId: string, userId: string) {
  const session = await getSession();
  if (!session?.userId)
    return {
      errors: {
        session: '로그인 세션이 만료되었습니다.',
      },
    };

  await likeComment(commentId, userId);
}

export async function cancelLikeCommentAction(commentId: string, userId: string) {
  const session = await getSession();
  if (!session?.userId)
    if (!session?.userId)
      return {
        errors: {
          session: '로그인 세션이 만료되었습니다.',
        },
      };

  await cancelLikeComment(commentId, userId);
}

export async function submitMatchResult(
  matchResult: { winnerId: string; loserId: string }[],
  worldcupId: string,
) {
  try {
    await db.transaction(async (tx) => {
      for (let i = 0; i < matchResult.length - 1; i++) {
        const { winnerId, loserId } = matchResult[i];
        await tx.insert(matchResults).values({ worldcupId, winnerId, loserId });
      }

      const { winnerId: finalWinnerId, loserId: finalLoserId } = matchResult[matchResult.length - 1];
      await tx
        .insert(matchResults)
        .values({ winnerId: finalWinnerId, loserId: finalLoserId, isFinalMatch: true, worldcupId });
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

export async function getWorldcupLikes(worldcupId: string) {
  try {
    const session = await getSession();
    const userId = session?.userId;

    let result;
    if (userId) {
      result = {
        isLiked: await db.$count(
          worldcupLikes,
          and(eq(worldcupLikes.worldcupId, worldcupId), eq(worldcupLikes.userId, userId)),
        ),
        likeCount: await db.$count(worldcupLikes, eq(worldcupLikes.worldcupId, worldcupId)),
      };
    } else {
      result = {
        likeCount: await db.$count(worldcupLikes, eq(worldcupLikes.worldcupId, worldcupId)),
      };
    }

    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function likeWorldcupAction(worldcupId: string) {
  try {
    const session = await getSession();
    const userId = session?.userId;
    if (!userId) throw new Error('로그인 세션이 만료되었습니다.');

    await likeWorldcup(worldcupId, userId);
  } catch (error) {
    console.error(error);
  }
}

export async function unlikeWorldcupAction(worldcupId: string) {
  try {
    const session = await getSession();
    const userId = session?.userId;
    if (!userId) throw new Error('로그인 세션이 만료되었습니다.');

    await unlikeWorldcup(worldcupId, userId);
  } catch (error) {
    console.error(error);
  }
}

export async function isWorldcupFavourite(worldcupId: string) {
  try {
    const session = await getSession();
    const userId = session?.userId;
    if (!userId) throw new Error('로그인 세션이 만료되었습니다.');

    const result = await db
      .select()
      .from(worldcupFavourites)
      .where(and(eq(worldcupFavourites.worldcupId, worldcupId), eq(worldcupFavourites.userId, userId)));

    if (result.length) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function addWorldcupFavouriteAction(worldcupId: string) {
  try {
    const session = await getSession();
    const userId = session?.userId;
    if (!userId) throw new Error('로그인 세션이 만료되었습니다.');

    await addWorldcupFavourite(worldcupId, userId);
  } catch (error) {
    console.error(error);
    // 중복 즐겨찾기 추가시 여기서 에러 던짐 => 더 쉬운 에러처리 방안?
    throw error;
  }
}

export async function removeWorldcupFavouriteAction(worldcupId: string) {
  try {
    const session = await getSession();
    const userId = session?.userId;
    if (!userId) throw new Error('로그인 세션이 만료되었습니다.');

    await removeWorldcupFavourite(worldcupId, userId);
  } catch (error) {
    console.error(error);
  }
}
