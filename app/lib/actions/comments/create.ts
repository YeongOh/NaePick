'use server';

import { COMMENT_ID_LENGTH, COMMENT_TEXT_MAX_LENGTH } from '@/app/constants';
import { pool } from '../../db';
import { getSession } from '../session';
import { nanoid } from 'nanoid';
import { Comment } from '../../definitions';

export type CreateCommentResponse = {
  errors?: {
    text?: string[];
  };
  message?: string | null;
  newComment?: Comment | null;
};

export async function createComment(
  textInput: string,
  worldcupId: string,
  votedCandidateId: string | null = null
) {
  const session = await getSession();

  const text = textInput.trim();

  if (text.length === 0) {
    const textError = { text: ['댓글은 공백 제외 한 자 이상이어야합니다.'] };
    return { errors: textError };
  }

  if (text.length > COMMENT_TEXT_MAX_LENGTH) {
    const textError = {
      text: [`댓글은 ${COMMENT_TEXT_MAX_LENGTH} 이하여야합니다.`],
    };
    return { errors: textError };
  }

  const userId = session?.userId;

  try {
    const commentId = nanoid(COMMENT_ID_LENGTH);

    let votedFor = null;

    if (votedCandidateId) {
      const [result, fields] = await pool.query(
        `SELECT name FROM candidate WHERE candidate_id = ?`,
        [votedCandidateId]
      );
      if (result && result[0]) {
        votedFor = result[0].name;
      }
    }

    if (!userId) {
      const [result, fields] = await pool.query(
        `INSERT INTO comment (comment_id, worldcup_id, user_id, text, is_anonymous, voted_candidate_id) 
      VALUES (?, ?, ?, ?, ?, ?)`,
        [commentId, worldcupId, null, text, true, votedCandidateId]
      );
      const newComment = {
        worldcupId,
        nickname: null,
        commentId,
        userId: null,
        text,
        votedFor,
        isAnonymous: true,
        createdAt: String(new Date()),
        updatedAt: String(new Date()),
      };
      console.log(newComment);
      return { newComment };
    } else {
      const nickname = session?.nickname;
      const [result, fields] = await pool.query(
        `INSERT INTO comment (comment_id, worldcup_id, user_id, text, is_anonymous, voted_candidate_id) 
    VALUES (?, ?, ?, ?, ?, ?)`,
        [commentId, worldcupId, userId, text, false, votedCandidateId]
      );
      const newComment = {
        worldcupId,
        nickname,
        commentId,
        userId,
        text,
        votedFor,
        isAnonymous: false,
        createdAt: String(new Date()),
        updatedAt: String(new Date()),
      };
      console.log(newComment);
      return { newComment };
    }
  } catch (error) {
    console.log(error);
    return {
      message: '댓글 추가에 실패했습니다',
    };
  }
}
