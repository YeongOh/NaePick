'use server';

import { redirect } from 'next/navigation';

import { getSession } from '@/app/lib/session';
import { verifyWorldcupOwner } from '@/app/lib/worldcup/auth';
import { updateWorldcup } from '@/app/lib/worldcup/service';

import { TWorldcupFormSchema, WorldcupFormSchema } from '../../type';

export async function editWorldcupAction(data: TWorldcupFormSchema, worldcupId: string) {
  const validatedFields = WorldcupFormSchema.safeParse(data);

  if (!validatedFields.success) {
    let parseError = {};
    validatedFields.error.issues.forEach((issue) => {
      parseError = { ...parseError, [issue.path[0]]: issue.message };
    });
    return {
      errors: parseError,
    };
  }

  const { title, description, publicity, categoryId } = validatedFields.data;

  try {
    const session = await getSession();
    if (!session?.userId) {
      return {
        errors: { session: '로그인 세션이 만료되었습니다.' },
      };
    }

    const isOwner = await verifyWorldcupOwner(worldcupId, session.userId);
    if (!isOwner)
      return {
        errors: { session: '수정할 권한이 없습니다.' },
      };

    await updateWorldcup({ description: description || null, worldcupId, title, publicity, categoryId });
  } catch (error) {
    console.error(error);
    return {
      errors: { server: '이상형 월드컵을 수정하는 데 실패했습니다.' },
    };
  }

  redirect(`/wc/edit-candidates/${worldcupId}`);
}
