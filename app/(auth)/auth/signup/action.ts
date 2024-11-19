'use server';

import { redirect } from 'next/navigation';

import { createUser } from '@/app/lib/auth/service';
import { findUserWithDuplicateEmailOrNickname } from '@/app/lib/auth/validation';
import { createSession } from '@/app/lib/session';

import { signupFormSchema, TSignupFormSchema } from './types';

export async function signupAction(data: TSignupFormSchema) {
  const validatedFields = signupFormSchema.safeParse(data);

  if (!validatedFields.success) {
    let parseError = {};
    validatedFields.error.issues.forEach((issue) => {
      parseError = { ...parseError, [issue.path[0]]: issue.message };
    });
    return {
      errors: parseError,
    };
  }

  const { email, nickname, password } = validatedFields.data;

  try {
    const usersFound = await findUserWithDuplicateEmailOrNickname(email, nickname);

    if (usersFound && usersFound.length) {
      let errors = {};
      usersFound.forEach((user) => {
        if (user.email === email) errors = { ...errors, email: '이미 존재하는 이메일입니다.' };
        if (user.nickname === nickname) errors = { ...errors, nickname: '이미 존재하는 닉네임입니다.' };
      });
      return { errors };
    }

    const newUserId = await createUser({ email, nickname, password });
    if (!newUserId) {
      return {
        errors: {
          server: '서버 오류로 인해 회원가입에 실패했습니다.',
        },
      };
    }

    await createSession({ userId: newUserId, profilePath: null, nickname, email });
  } catch (error) {
    console.error(error);
    return {
      errors: {
        server: '서버 오류로 인해 회원가입에 실패했습니다.',
      },
    };
  }

  redirect('/');
}
