'use server';

import { redirect } from 'next/navigation';

import { findUserWithEmail } from '@/app/lib/auth/service';
import { verifyPassword } from '@/app/lib/auth/utils';
import { createSession } from '@/app/lib/session';

import { loginFormSchema, TLoginFormSchema } from './types';

export async function loginAction(data: TLoginFormSchema) {
  const validatedFields = loginFormSchema.safeParse(data);

  if (!validatedFields.success) {
    let parseError = {};
    validatedFields.error.issues.forEach((issue) => {
      parseError = { ...parseError, [issue.path[0]]: issue.message };
    });
    return {
      errors: parseError,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await findUserWithEmail(email);
    if (!user)
      return {
        errors: {
          email: '등록되지 않은 이메일입니다.',
        },
      };

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword)
      return {
        errors: {
          password: '비밀번호가 틀렸습니다.',
        },
      };

    const { userId, nickname, profilePath } = user;

    await createSession({ userId, nickname, profilePath, email });
  } catch (error) {
    console.error(error);
    return {
      errors: { server: '서버 문제로 인해 로그인에 실패하였습니다.' },
    };
  }

  redirect('/');
}
