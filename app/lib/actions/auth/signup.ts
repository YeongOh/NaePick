'use server';

import {
  EMAIL_MAX_LENGTH,
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from '@/app/constants';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { FieldPacket, RowDataPacket } from 'mysql2';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { User } from '../../definitions';
import { pool } from '../../db';
import { createSession } from '../session';

const FormSchema = z
  .object({
    username: z
      .string()
      .min(USERNAME_MIN_LENGTH, {
        message: `아이디는 ${USERNAME_MIN_LENGTH}글자 이상이어야 합니다.`,
      })
      .max(USERNAME_MAX_LENGTH, {
        message: `${USERNAME_MAX_LENGTH}자 이하이어야 합니다.`,
      })
      .trim(),
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
  username?: string[];
  email?: string[];
  nickname?: string[];
  password?: string[];
  confirmPassword?: string[];
};

export async function signup(state: SignupState, formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    username: formData.get('username'),
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

  const { username, email, password, nickname } = validatedFields.data;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    // check if userid or email already exists in db
    const [duplicateResult, duplicateFields]: [
      Pick<User, 'userId' | 'email' | 'nickname'>[] & RowDataPacket[],
      FieldPacket[]
    ] = await pool.query(
      `SELECT username, email, nickname
      FROM Users
      WHERE username = ? OR email = ? OR nickname = ?;`,
      [username, email, nickname]
    );

    const duplicateUser = duplicateResult?.[0];
    if (duplicateUser) {
      const errors: SignupError = {};
      if (username === duplicateUser.username)
        errors.username = ['이미 존재하는 아이디입니다.'];
      if (nickname === duplicateUser.nickname)
        errors.nickname = ['이미 존재하는 닉네임입니다.'];
      if (email === duplicateUser.email)
        errors.email = ['이미 존재하는 이메일입니다.'];

      return {
        message: '회원가입에 실패했습니다. (e1)',
        errors,
      };
    }

    const id = uuidv4();
    const role = 'user';

    await pool.query(
      `INSERT INTO Users (id, username, email, nickname, role, password)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [id, username, email, nickname, role, hashedPassword]
    );

    await createSession({ id, username, nickname, email });
  } catch (error) {
    console.log(error);
    return {
      message: '회원가입에 실패했습니다. (e4).',
    };
  }
  revalidatePath('/');
  redirect('/');
}
