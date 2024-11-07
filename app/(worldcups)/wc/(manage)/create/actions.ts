'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import {
  WORLDCUP_DESCRIPTION_MAX_LENGTH,
  WORLDCUP_ID_LENGTH,
  WORLDCUP_TITLE_MAX_LENGTH,
  WORLDCUP_TITLE_MIN_LENGTH,
} from '@/app/constants';
import { getSession } from '@/app/lib/session';
import { pool } from '@/app/lib/database';

const CreateWorldcupFormSchema = z.object({
  title: z
    .string()
    .min(WORLDCUP_TITLE_MIN_LENGTH, {
      message: `제목은 ${WORLDCUP_TITLE_MIN_LENGTH}자 이상이어야 합니다.`,
    })
    .max(WORLDCUP_TITLE_MAX_LENGTH, {
      message: `제목은 ${WORLDCUP_TITLE_MAX_LENGTH}자 이하여야 합니다.`,
    }),
  description: z
    .string()
    .max(WORLDCUP_DESCRIPTION_MAX_LENGTH, {
      message: `설명은 ${WORLDCUP_DESCRIPTION_MAX_LENGTH}자 이하여야 합니다.`,
    })
    .optional(),
  publicity: z.enum(['public', 'unlisted', 'private']),
  categoryId: z.coerce
    .number()
    .positive({ message: '카테고리를 선택해주세요.' }),
});

export type CreateWorldcupFormState = {
  errors?: {
    title?: string[];
    description?: string[];
    publicity?: string[];
    categoryId?: string[];
  };
  message?: string | null;
};

export async function createWorldcup(
  prevState: CreateWorldcupFormState,
  formData: FormData
) {
  const validatedFields = CreateWorldcupFormSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    publicity: formData.get('publicity'),
    categoryId: formData.get('categoryId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '누락된 항목이 있습니다.',
    };
  }

  const { title, description, publicity, categoryId } = validatedFields.data;

  const session = await getSession();
  if (!session?.userId) {
    return {
      message: '로그인 세션이 만료되었습니다.',
    };
  }

  const worldcupId = nanoid(WORLDCUP_ID_LENGTH);

  try {
    await pool.query(
      `INSERT INTO worldcup 
                (worldcup_id, title, description, publicity, user_id, category_id)          
                VALUES (?,?,?,?,?,?)`,
      [worldcupId, title, description, publicity, session.userId, categoryId]
    );
  } catch (error) {
    console.log(error);
    return {
      message: '이상형 월드컵 생성에 실패했습니다.',
    };
  }
  redirect(`/wc/edit-candidates/${worldcupId}`);
}
