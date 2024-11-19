'use server';

import { redirect, RedirectType } from 'next/navigation';

import { getSession } from '@/app/lib/session';
import { createWorldcup } from '@/app/lib/worldcup/service';

import { TWorldcupFormSchema, WorldcupFormSchema } from '../type';

export async function createWorldcupAction(data: TWorldcupFormSchema) {
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

  let worldcupId;
  try {
    const session = await getSession();
    if (!session?.userId) {
      return {
        errors: { session: '로그인 세션이 만료되었습니다.' },
      };
    }

    worldcupId = await createWorldcup({
      description: description || null,
      userId: session.userId,
      title,
      publicity,
      categoryId,
    });
  } catch (error) {
    console.error(error);
    return {
      errors: { server: '이상형 월드컵을 생성하는 데 실패했습니다.' },
    };
  }

  redirect(`/wc/edit-candidates/${worldcupId}`);
}
