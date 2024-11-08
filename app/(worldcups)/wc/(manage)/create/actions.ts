'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import {
  WORLDCUP_DESCRIPTION_MAX_LENGTH,
  WORLDCUP_TITLE_MAX_LENGTH,
  WORLDCUP_TITLE_MIN_LENGTH,
} from '@/app/constants';
import { getSession } from '@/app/lib/session';
import { createWorldcup } from '@/app/lib/worldcups/service';

export const WorldcupFormSchema = z.object({
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
});

export type WorldcupFormState = {
  errors?: {
    title?: string[];
    description?: string[];
    publicity?: string[];
    categoryId?: string[];
  };
  message?: string | null;
};

export async function createWorldcupAction(prevState: WorldcupFormState, formData: FormData) {
  const validatedFields = WorldcupFormSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    publicity: formData.get('publicity'),
    categoryId: formData.get('categoryId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '필수 항목이 누락되었습니다.',
    };
  }

  const { title, description, publicity, categoryId } = validatedFields.data;

  const session = await getSession();
  if (!session?.userId) {
    return {
      message: '로그인 세션이 만료되었습니다.',
    };
  }

  try {
    const worldcupId = await createWorldcup({
      description: description || null,
      userId: session.userId,
      title,
      publicity,
      categoryId,
    });

    redirect(`/wc/edit-candidates/${worldcupId}`);
  } catch (error) {
    console.log(error);
    return {
      message: '이상형 월드컵을 생성하는 데 실패했습니다.',
    };
  }
}
