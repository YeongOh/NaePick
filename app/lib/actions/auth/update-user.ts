'use server';

import {
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@/app/constants';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { FieldPacket, RowDataPacket } from 'mysql2';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { User } from '../../definitions';
import { pool } from '../../db';
import { createSession, getSession } from '../session';

const FormSchema = z
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
    oldPassword: z.string(),
    changePassword: z.boolean(),
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
      .nullable(),
    confirmNewPassword: z.string().nullable(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: '패스워드가 일치하지 않습니다.',
    path: ['confirmNewPassword'],
  });

export type UpdateUserState = {
  errors?: UpdateUserError;
  message?: string | null;
};

export type UpdateUserError = {
  nickname?: string[];
  changePassword?: string[];
  oldPassword?: string[];
  newPassword?: string[];
  confirmNewPassword?: string[];
};

export async function updateUser(state: UpdateUserState, formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    nickname: formData.get('nickname'),
    oldPassword: formData.get('oldPassword'),
    changePassword: Boolean(formData.get('changePassword')),
    newPassword: formData.get('newPassword'),
    confirmNewPassword: formData.get('confirmNewPassword'),
  });

  if (!validatedFields.success) {
    console.log('누락');
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '누락된 항목이 있습니다.',
    };
  }

  const { nickname, oldPassword, changePassword, newPassword } =
    validatedFields.data;

  const connection = await pool.getConnection();
  try {
    const session = await getSession();
    if (!session?.userId) {
      return {
        message: '현재 로그인된 상태가 아닙니다.',
      };
    }

    await connection.beginTransaction();

    const [result, fields]: [
      Pick<User, 'email' | 'nickname' | 'password'>[] & RowDataPacket[],
      FieldPacket[]
    ] = await connection.query(
      `SELECT email, nickname, password
        FROM user
        WHERE user_id = ?;`,
      [session.userId]
    );

    const user = result?.[0];
    if (!user) {
      return {
        message: '알수없는 에러가 발생했습니다.(e1)',
      };
    }

    if ((await bcrypt.compare(oldPassword, user.password)) === false) {
      return {
        errors: {
          oldPassword: ['패스워드가 틀렸습니다.'],
        },
        message: '회원정보 수정에 실패했습니다. (e2)',
      };
    }

    // 닉네임이 원래 닉네임과 다를 경우 수정
    if (nickname !== user.nickname) {
      const [duplicatedUserResult, duplicatedFields]: [User[], FieldPacket[]] =
        await connection.query(
          `SELECT * FROM user
             WHERE nickname = ? AND user_id != ?;`,
          [nickname, session.userId]
        );
      if (duplicatedUserResult?.[0]) {
        console.log(5);
        return {
          errors: {
            nickname: ['이미 존재하는 닉네임입니다.'],
          },
          message: '수정에 실패했습니다. (e3)',
        };
      } else {
        await connection.query(
          `UPDATE user
             SET nickname = ?
             WHERE user_id = ?;`,
          [nickname, session.userId]
        );
      }
    }

    if (changePassword && newPassword) {
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
      await connection.query(
        `UPDATE user
        SET password = ?
        WHERE user_id = ?;`,
        [hashedNewPassword, session.userId]
      );
    }
    await connection.commit();

    if (nickname) {
      await createSession({ ...session, nickname });
    }
  } catch (error) {
    await connection.rollback();
    console.log(error);
    return {
      message: '회원가입에 실패했습니다. (e4).',
    };
  }
  revalidatePath('/');
  redirect('/');
}
