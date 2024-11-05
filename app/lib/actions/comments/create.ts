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

export async function createComment(textInput: string, worldcupId: string) {
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

    if (!userId) {
      const [result, fields] = await pool.query(
        `INSERT INTO comment (comment_id, worldcup_id, user_id, text, is_anonymous) 
      VALUES (?, ?, ?, ?, ?)`,
        [commentId, worldcupId, null, text, true]
      );
      const newComment = {
        worldcupId,
        nickname: null,
        commentId,
        userId: null,
        text,
        isAnonymous: true,
        createdAt: String(new Date()),
        updatedAt: String(new Date()),
      };
      return { newComment };
    } else {
      const nickname = session?.nickname;
      const [result, fields] = await pool.query(
        `INSERT INTO comment (comment_id, worldcup_id, user_id, text, is_anonymous) 
    VALUES (?, ?, ?, ?, ?)`,
        [commentId, worldcupId, userId, text, false]
      );
      const newComment = {
        worldcupId,
        nickname,
        commentId,
        userId,
        text,
        isAnonymous: false,
        createdAt: String(new Date()),
        updatedAt: String(new Date()),
      };
      return { newComment };
    }
  } catch (error) {
    console.log(error);
    return {
      message: '댓글 추가에 실패했습니다',
    };
  }
}
