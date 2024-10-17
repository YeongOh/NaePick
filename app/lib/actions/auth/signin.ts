'use server';

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from '@/app/constants';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { FieldPacket, RowDataPacket } from 'mysql2';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { User } from '../../definitions';
import { pool } from '../../db';
import { createSession } from '../session';

const FormSchema = z.object({
  username: z
    .string()
    .min(USERNAME_MIN_LENGTH, {
      message: `올바른 형식이 아닙니다.`,
    })
    .max(USERNAME_MAX_LENGTH, {
      message: `올바른 형식이 아닙니다.`,
    })
    .trim(),
  password: z
    .string() // 수정 필요 - 올바른 항목 여러개가 표시됨
    .min(PASSWORD_MIN_LENGTH, {
      message: `올바른 형식이 아닙니다.`,
    })
    .max(PASSWORD_MAX_LENGTH, {
      message: `올바른 형식이 아닙니다.`,
    })
    .regex(/[a-zA-Z]/, {
      message: '올바른 형식이 아닙니다.',
    })
    .regex(/[0-9]/, {
      message: '올바른 형식이 아닙니다.',
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: '올바른 형식이 아닙니다.',
    })
    .trim(),
});

export type SigninState = {
  errors?: {
    username?: string[];
    password?: string[];
  };
  message?: string | null;
};

export async function signin(state: SigninState, formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '누락된 항목이 있습니다.',
    };
  }

  const { username, password } = validatedFields.data;

  try {
    const [result, fields]: [
      Pick<User, 'id' | 'username' | 'email' | 'password' | 'nickname'>[] &
        RowDataPacket[],
      FieldPacket[]
    ] = await pool.query(
      `SELECT id, nickname, username, password, email
      FROM Users
      WHERE username = ?;`,
      [username]
    );

    const user = result?.[0];
    if (!user) {
      return {
        errors: {
          username: ['존재하지 않는 아이디입니다.'],
        },
        message: '로그인에 실패했습니다. (e1)',
      };
    }

    if ((await bcrypt.compare(password, user.password)) === false) {
      return {
        errors: {
          password: ['패스워드가 틀렸습니다.'],
        },
        message: '로그인에 실패했습니다. (e2)',
      };
    }

    const loginInfo = {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      username,
    };
    await createSession(loginInfo);
  } catch (error) {
    console.log(error);
    return {
      message: '로그인에 실패했습니다. (e4).',
    };
  }
  revalidatePath('/');
  redirect('/');
}
