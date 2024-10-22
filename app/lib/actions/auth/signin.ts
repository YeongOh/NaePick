'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { FieldPacket, RowDataPacket } from 'mysql2';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { User } from '../../definitions';
import { pool } from '../../db';
import { createSession } from '../session';

const FormSchema = z.object({
  email: z.string().email({ message: '올바른 이메일을 입력해주세요.' }),
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
      Pick<User, 'userId' | 'email' | 'password' | 'nickname'>[] &
        RowDataPacket[],
      FieldPacket[]
    ] = await pool.query(
      `SELECT user_id AS userId,
              nickname, password, email
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

    console.log(user);
    const { userId, nickname } = user;
    console.log(userId, nickname);

    await createSession({ userId, nickname, email });
  } catch (error) {
    console.log(error);
    return {
      message: '로그인에 실패했습니다. (e4).',
    };
  }

  revalidatePath('/');
  redirect('/');
}
