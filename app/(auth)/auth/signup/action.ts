'use server';

import {
  EMAIL_MAX_LENGTH,
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@/app/constants';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createSession } from '@/app/lib/session';
import { findUserWithDuplicateEmailOrNickname } from '@/app/lib/auth/validation';
import { createUser } from '@/app/lib/auth/service';

const FormSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email({ message: '이메일이 올바르지 않습니다.' })
      .max(EMAIL_MAX_LENGTH, {
        message: `${EMAIL_MAX_LENGTH}자 이하이어야 합니다.`,
      }),
    nickname: z
      .string()
      .trim()
      .min(NICKNAME_MIN_LENGTH, {
        message: `닉네임은 ${NICKNAME_MIN_LENGTH}자 이상이어야 합니다.`,
      })
      .max(NICKNAME_MAX_LENGTH, {
        message: `${NICKNAME_MAX_LENGTH}자 이하이어야 합니다.`,
      }),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, {
        message: `${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`,
      })
      .max(PASSWORD_MAX_LENGTH, {
        message: `${PASSWORD_MAX_LENGTH}자 이하이어야 합니다.`,
      })
      .regex(/[a-zA-Z]/, { message: '최소 한 개의 문자를 포함해야 합니다.' })
      .regex(/[0-9]/, { message: '최소 한 개의 숫자를 포함해야 합니다.' })
      .regex(/[^a-zA-Z0-9]/, {
        message: '최소 한 개의 특수 문자를 포함해야 합니다.',
      }),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export type SignupState = {
  errors?: SignupError;
  message?: string | null;
};

export type SignupError = {
  email?: string[];
  nickname?: string[];
  password?: string[];
  confirmPassword?: string[];
};

export async function signupAction(state: SignupState, formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    email: formData.get('email'),
    nickname: formData.get('nickname'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '필수 항목이 누락되었습니다.',
    };
  }

  const { email, nickname, password } = validatedFields.data;

  try {
    const usersFound = await findUserWithDuplicateEmailOrNickname(email, nickname);

    if (usersFound && usersFound.length) {
      const errors: SignupError = {};
      usersFound.forEach((user) => {
        if (user.email === email) errors.email = ['이미 존재하는 이메일입니다.'];
        if (user.nickname === nickname) errors.nickname = ['이미 존재하는 닉네임입니다.'];
      });
      return { errors };
    }

    const newUserId = await createUser({ email, nickname, password });
    if (!newUserId) {
      throw new Error('회원가입에 실패했습니다.');
    }

    await createSession({ userId: newUserId, profilePath: null, nickname });
  } catch (error) {
    console.error(error);
    return {
      message: '서버 오류로 인해 회원가입에 실패했습니다.',
    };
  }

  redirect('/');
}
