'use server';

import { z } from 'zod';

import { redirect } from 'next/navigation';
import { getSession } from '@/app/lib/session';
import { updateWorldcup } from '@/app/lib/worldcups/service';
import { WorldcupFormSchema, WorldcupFormState } from '../../create/actions';
import { veryifyWorldcupOwner } from '@/app/lib/worldcups/auth';

export async function editWorldcupAction(prevState: WorldcupFormState, formData: FormData) {
  const validatedFields = WorldcupFormSchema.extend({ worldcupId: z.string() }).safeParse({
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

    const isOwner = await veryifyWorldcupOwner(worldcupId, session.userId);
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
