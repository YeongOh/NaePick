import { z } from 'zod';

import {
  EMAIL_MAX_LENGTH,
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@/app/constants';

export const signupFormSchema = z
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

export type TSignupFormSchema = z.infer<typeof signupFormSchema>;
