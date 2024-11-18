import { z } from 'zod';

import {
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@/app/constants';

export const EditFormSchema = z
  .object({
    nickname: z
      .string()
      .trim()
      .min(NICKNAME_MIN_LENGTH, {
        message: `아이디는 ${NICKNAME_MIN_LENGTH}글자 이상이어야 합니다.`,
      })
      .max(NICKNAME_MAX_LENGTH, {
        message: `${NICKNAME_MAX_LENGTH}자 이하이어야 합니다.`,
      }),
    oldPassword: z.string().min(1, {
      message: '비밀번호를 입력해주세요.',
    }),
    newPassword: z
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
        message: '최소 한 개의 특수문자를 포함해야 합니다.',
      })
      .optional(),
    confirmNewPassword: z.string().optional(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: '예전 비밀번호와 동일한 비밀번호입니다.',
    path: ['confirmNewPassword'],
  });

export type TEditFormSchema = z.infer<typeof EditFormSchema>;
