'use server';

import { z } from 'zod';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  WORLDCUP_DESCRIPTION_MAX_LENGTH,
  WORLDCUP_TITLE_MAX_LENGTH,
  WORLDCUP_TITLE_MIN_LENGTH,
} from '@/app/constants';
import { getSession } from '@/app/lib/session';
import { pool } from '@/app/lib/database';
import { validateWorldcupOwnership } from '@/app/lib/worldcups/auth';

const UpdatePostFormSchema = z.object({
  worldcupId: z.string(),
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

export type UpdateWorldcupInfoFormState = {
  errors?: {
    title?: string[];
    description?: string[];
    publicity?: string[];
    categoryId?: string[];
  };
  message?: string | null;
};

export async function updateWorldcupInfo(
  prevState: UpdateWorldcupInfoFormState,
  formData: FormData
) {
  const validatedFields = UpdatePostFormSchema.safeParse({
    worldcupId: formData.get('worldcupId'),
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

  const { worldcupId, title, description, publicity, categoryId } =
    validatedFields.data;

  const session = await getSession();
  if (!session?.userId) {
    return {
      message: '로그인 세션이 만료되었습니다.',
    };
  }

  try {
    await validateWorldcupOwnership(worldcupId, session.userId);

    pool.query(
      `UPDATE worldcup 
      SET title = ?, description = ?, publicity = ?, category_id = ?
      WHERE worldcup_id = ?`,
      [title, description, publicity, categoryId, worldcupId]
    );
  } catch (error) {
    return {
      message: '이상형 월드컵 수정에 실패했습니다.',
    };
  }
  revalidatePath(`/wc/edit/${worldcupId}`);
  redirect(`/wc/edit-candidates/${worldcupId}`);
}
