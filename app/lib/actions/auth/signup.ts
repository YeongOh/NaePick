'use server';

import {
  EMAIL_MAX_LENGTH,
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USER_ID_LENGTH,
} from '@/app/constants';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { FieldPacket, RowDataPacket } from 'mysql2';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { User } from '../../definitions';
import { pool } from '../../db';
import { createSession } from '../session';
import { nanoid } from 'nanoid';

const FormSchema = z
  .object({
    email: z
      .string()
      .email({ message: '올바른 이메일을 입력해주세요.' })
      .max(EMAIL_MAX_LENGTH, {
        message: `${EMAIL_MAX_LENGTH}자 이하이어야 합니다.`,
      })
      .trim(),
    nickname: z
      .string()
      .min(NICKNAME_MIN_LENGTH, {
        message: `아이디는 ${NICKNAME_MIN_LENGTH}글자 이상이어야 합니다.`,
      })
      .max(NICKNAME_MAX_LENGTH, {
        message: `${NICKNAME_MAX_LENGTH}자 이하이어야 합니다.`,
      })
      .trim(),
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
        message: '최소 한 개의 특수문자를 포함해야 합니다.',
      })
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '패스워드가 일치하지 않습니다.',
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

export async function signup(state: SignupState, formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    email: formData.get('email'),
    nickname: formData.get('nickname'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '누락된 항목이 있습니다.',
    };
  }

  const { email, password, nickname } = validatedFields.data;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    // 이메일이나 닉네임이 이미 사용되고 있는지 확인
    const [duplicateResult, duplicateFields]: [
      Pick<User, 'email' | 'nickname'>[] & RowDataPacket[],
      FieldPacket[]
    ] = await pool.query(
      `SELECT email, nickname
      FROM user
      WHERE email = ? OR nickname = ?;`,
      [email, nickname]
    );

    const duplicateUser = duplicateResult?.[0];
    if (duplicateUser) {
      const errors: SignupError = {};
      if (nickname === duplicateUser.nickname)
        errors.nickname = ['이미 존재하는 닉네임입니다.'];
      if (email === duplicateUser.email)
        errors.email = ['이미 존재하는 이메일입니다.'];

      return {
        message: '회원가입에 실패했습니다. (e1)',
        errors,
      };
    }

    const userId = nanoid(USER_ID_LENGTH);

    await pool.query(
      `INSERT INTO user (user_id, email, nickname, password)
      VALUES (?, ?, ?, ?)`,
      [userId, email, nickname, hashedPassword]
    );

    await createSession({ userId, nickname, email });
  } catch (error) {
    console.log(error);
    return {
      message: '회원가입에 실패했습니다. (e4).',
    };
  }

  // TODO: 회원가입 성공 토스트

  revalidatePath('/');
  redirect('/');
}
