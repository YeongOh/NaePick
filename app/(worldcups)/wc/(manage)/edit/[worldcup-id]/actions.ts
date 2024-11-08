'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { getSession } from '@/app/lib/session';
import { updateWorldcup } from '@/app/lib/worldcups/service';
import { verifyWorldcupOwner } from '@/app/lib/worldcups/auth';
import {
  WORLDCUP_DESCRIPTION_MAX_LENGTH,
  WORLDCUP_TITLE_MAX_LENGTH,
  WORLDCUP_TITLE_MIN_LENGTH,
} from '@/app/constants';
import { WorldcupFormState } from '../../create/actions';

const WorldcupFormSchema = z
  .object({
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
    categoryId: z.coerce.number().positive({ message: '카테고리를 선택해주세요.' }),
  })
  .extend({ worldcupId: z.string() });

export async function editWorldcupAction(prevState: WorldcupFormState, formData: FormData) {
  const validatedFields = WorldcupFormSchema.safeParse({
    worldcupId: formData.get('worldcupId'),
    title: formData.get('title'),
    description: formData.get('description'),
    publicity: formData.get('publicity'),
    categoryId: formData.get('categoryId'),
  });

  if (!validatedFields.success)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '필수 항목이 누락되었습니다.',
    };

  const { worldcupId, title, description, publicity, categoryId } = validatedFields.data;

  try {
    const session = await getSession();
    if (!session?.userId)
      return {
        message: '로그인 세션이 만료되었습니다.',
      };

    const isOwner = await verifyWorldcupOwner(worldcupId, session.userId);
    if (!isOwner)
      return {
        message: '수정할 권한이 없습니다.',
      };

    await updateWorldcup({ description: description || null, worldcupId, title, publicity, categoryId });
  } catch (error) {
    console.error(error);
    return {
      message: '이상형 월드컵 수정에 실패했습니다.',
    };
  }

  redirect(`/wc/edit-candidates/${worldcupId}`);
}
