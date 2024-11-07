'use server';

import { COMMENT_TEXT_MAX_LENGTH } from '@/app/constants';
import { canUserEditComment } from '@/app/lib/comment/auth';
import {
  createComment,
  deleteComment,
  updateComment,
} from '@/app/lib/comment/service';
import { db } from '@/app/lib/database';
import { getSession } from '@/app/lib/session';
import { MatchResult } from '@/app/lib/types';

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

  if (trimText.length === 0) {
    return { errors: { text: ['댓글은 공백 제외 한 자 이상이어야합니다.'] } };
  }

  if (trimText.length > COMMENT_TEXT_MAX_LENGTH) {
    return {
      errors: { text: [`댓글은 ${COMMENT_TEXT_MAX_LENGTH} 이하여야합니다.`] },
    };
  }

  const session = await getSession();
  const userId = session?.userId;

  const data = await createComment({
    worldcupId,
    userId,
    votedCandidateId,
    text: trimText,
  });
  return {
    data: {
      ...data,
      profilePathname: session?.profilePathname,
      nickname: session?.nickname,
    },
  };
}

export async function updateCommentAction({
  commentId,
  text,
}: {
  commentId: string;
  text: string;
}) {
  const session = await getSession();
  if (!session?.userId) {
    throw new Error('로그인 세션이 만료되었습니다.');
  }

  // TODO: text length 확인

  const userId = session.userId;
  const isAuthorized = await canUserEditComment({ userId, commentId });
  if (!isAuthorized) {
    throw new Error('댓글을 삭제할 수 없습니다.');
  }
  console.log(commentId, text);

  updateComment({ commentId, text });
}

export async function deleteCommentAction(commentId: string) {
  const session = await getSession();
  if (!session?.userId) {
    throw new Error('로그인 세션이 만료되었습니다.');
  }

  const userId = session.userId;
  const isAuthorized = await canUserEditComment({ userId, commentId });
  if (!isAuthorized) {
    throw new Error('댓글을 삭제할 수 없습니다.');
  }

  return await deleteComment(commentId);
}

export async function submitMatchResult(
  matchResult: MatchResult[],
  worldcupId: string
) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const insertPromises = matchResult.map((match, i) => {
      if (i === matchResult.length - 1) {
        const query = `INSERT INTO match_result (winner_candidate_id, loser_candidate_id, worldcup_id, is_final_match)
      VALUES (?, ?, ?, ?)`;
        return connection.query(query, [
          match.winnerCandidateId,
          match.loserCandidateId,
          worldcupId,
          true,
        ]);
      }
      const query = `INSERT INTO match_result (winner_candidate_id, loser_candidate_id, worldcup_id)
      VALUES (?, ?, ?)`;
      return connection.query(query, [
        match.winnerCandidateId,
        match.loserCandidateId,
        worldcupId,
      ]);
    });

    const result = await Promise.all(insertPromises);
    await connection.commit();
  } catch (error) {
    console.log(error);
    await connection.rollback();
  }
}
