'use server';

import { COMMENT_TEXT_MAX_LENGTH } from '@/app/constants';
import { getCandidateName } from '@/app/lib/candidates/service';
import { verifyCommentOwner } from '@/app/lib/comment/auth';
import { createComment, deleteComment, updateComment } from '@/app/lib/comment/service';
import { db } from '@/app/lib/database';
import { candidates, comments, mediaTypes, users } from '@/app/lib/database/schema';
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
    const candidate = await getCandidateName(votedCandidateId);
    voted = candidate[0].name;
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

// export async function submitMatchResult(matchResult: MatchResult[], worldcupId: string) {
//   const connection = await db.getConnection();
//   try {
//     await connection.beginTransaction();

//     const insertPromises = matchResult.map((match, i) => {
//       if (i === matchResult.length - 1) {
//         const query = `INSERT INTO match_result (winner_candidate_id, loser_candidate_id, worldcup_id, is_final_match)
//       VALUES (?, ?, ?, ?)`;
//         return connection.query(query, [match.winnerCandidateId, match.loserCandidateId, worldcupId, true]);
//       }
//       const query = `INSERT INTO match_result (winner_candidate_id, loser_candidate_id, worldcup_id)
//       VALUES (?, ?, ?)`;
//       return connection.query(query, [match.winnerCandidateId, match.loserCandidateId, worldcupId]);
//     });

//     const result = await Promise.all(insertPromises);
//     await connection.commit();
//   } catch (error) {
//     console.log(error);
//     await connection.rollback();
//   }
// }

export async function getRandomCandidates(worldcupId: string, round: number) {
  try {
    const result = await db
      .select({ ...getTableColumns(candidates), mediaType: mediaTypes.name })
      .from(candidates)
      .innerJoin(mediaTypes, eq(mediaTypes.id, candidates.mediaTypeId))
      .orderBy(sql`rand()`)
      .limit(round);

    return result;
  } catch (error) {
    console.error(error);
  }
}
