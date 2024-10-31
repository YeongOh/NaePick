'use server';

import { COMMENT_ID_LENGTH, COMMENT_TEXT_MAX_LENGTH } from '@/app/constants';
import { z } from 'zod';
import { pool } from '../../db';
import { getSession } from '../session';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';

const FormSchema = z.object({
  worldcupId: z.string(),
  userId: z.string().optional(),
  text: z
    .string()
    .trim()
    .min(1, {
      message: `내용을 입력해주세요.`,
    })
    .max(COMMENT_TEXT_MAX_LENGTH, {
      message: `내용은 ${COMMENT_TEXT_MAX_LENGTH}자 이하이어야 합니다.`,
    }),
});

export type CommentState = {
  errors?: CommentError;
  message?: string | null;
  nickname?: string;
};

export type CommentError = {
  text?: string[];
  worldcupId?: string[];
};

export async function createComment(state: CommentState, formData: FormData) {
  const session = await getSession();

  const validatedFields = FormSchema.safeParse({
    userId: session.userId,
    worldcupId: formData.get('worldcupId'),
    text: formData.get('text'),
  });

  console.log(formData);

  console.log(validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '누락된 항목이 있습니다.',
    };
  }

  const { userId, text, worldcupId } = validatedFields.data;

  try {
    const commentId = nanoid(COMMENT_ID_LENGTH);

    if (!userId) {
      const [result, fields] = await pool.query(
        `INSERT INTO comment (comment_id, worldcup_id, user_id, text, is_anonymous) 
      VALUES (?, ?, ?, ?, ?)`,
        [commentId, worldcupId, null, text, true]
      );
    } else {
      const [result, fields] = await pool.query(
        `INSERT INTO comment (comment_id, worldcup_id, user_id, text, is_anonymous) 
    VALUES (?, ?, ?, ?, ?)`,
        [commentId, worldcupId, userId, text, false]
      );
    }
  } catch (error) {
    console.log(error);
    return {
      message: '댓글 추가에 실패했습니다',
    };
  }

  revalidatePath(`/worldcups/${worldcupId}`);
  return { nickname: session.nickname };
}
