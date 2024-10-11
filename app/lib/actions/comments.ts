'use server';

import { COMMENT_MAX_LENGTH } from '@/app/constants';
import { z } from 'zod';
import getConnection from '../db';
import { v4 as uuidv4 } from 'uuid';
import { getSession } from './session';
import { revalidatePath } from 'next/cache';

const FormSchema = z.object({
  postId: z.string(),
  userId: z.string(),
  text: z
    .string()
    .min(1, {
      message: `내용을 입력해주세요.`,
    })
    .max(COMMENT_MAX_LENGTH, {
      message: `${COMMENT_MAX_LENGTH}자 이하이어야 합니다.`,
    })
    .trim(),
});

export type CommentState = {
  errors?: CommentError;
  message?: string | null;
};

export type CommentError = {
  userId?: string[];
  text?: string[];
  postId?: string[];
};

export async function createComment(state: CommentState, formData: FormData) {
  const session = await getSession();

  const validatedFields = FormSchema.safeParse({
    userId: session.id,
    postId: formData.get('postId'),
    text: formData.get('text'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '누락된 항목이 있습니다.',
    };
  }

  const { userId, text, postId } = validatedFields.data;

  try {
    const connection = await getConnection();
    const commentId = uuidv4();

    const [result, fields] = await connection.execute(
      `INSERT INTO Comments (id, postId, userId, text) 
      VALUES (?, ?, ?, ?)`,
      [commentId, postId, userId, text]
    );

    // TODO
  } catch (error) {
    console.log(error);
    return {
      message: '댓글 추가 실패했습니다',
    };
  }
  revalidatePath(`/posts/${postId}`);
  revalidatePath(`/ranks/${postId}`);
  return {};
}
