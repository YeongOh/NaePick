'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { FieldPacket, RowDataPacket } from 'mysql2';
import { redirect } from 'next/navigation';
import { User } from '@/app/lib/types';
import { db } from '@/app/lib/database';
import { createSession } from '@/app/lib/session';

const FormSchema = z.object({
  email: z.string().email({ message: '올바른 이메일이 아닙니다.' }),
  password: z.string(),
});

export type SigninState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export async function signin(state: SigninState, formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '누락된 항목이 있습니다.',
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const [result, fields]: [
      Pick<
        User,
        'userId' | 'email' | 'password' | 'nickname' | 'profilePathname'
      >[] &
        RowDataPacket[],
      FieldPacket[]
    ] = await db.query(
      `SELECT user_id AS userId,
              nickname, password, email, profile_pathname as profilePathname
      FROM user
      WHERE email = ?;`,
      [email]
    );

    const user = result?.[0];
    if (!user) {
      return {
        errors: {
          email: ['존재하지 않는 이메일입니다.'],
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

    const { userId, nickname, profilePathname } = user;

    await createSession({ userId, nickname, profilePathname });
  } catch (error) {
    return {
      message: '로그인에 실패했습니다. (e4).',
    };
  }

  redirect('/');
}
