'use server';

import {
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USER_ID_LENGTH,
} from '@/app/constants';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createSession, getSession } from '@/app/lib/session';
import {
  findUserWithUserId,
  getUserProfilePath,
  updateUserNickname,
  updateUserPassword,
  updateUserProfilePath,
} from '@/app/lib/auth/service';
import { verifyPassword } from '@/app/lib/auth/utils';
import { isNicknameDuplicate } from '@/app/lib/auth/validation';
import { redirect } from 'next/navigation';
import { deleteImage, getSignedUrlForImage } from '@/app/lib/storage';
import { nanoid } from 'nanoid';
import path from 'path';

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
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmNewPassword'],
  });

type editUserError = {
  nickname?: string[];
  oldPassword?: string[];
  changePassword?: string[];
  newPassword?: string[];
  confirmNewPassword?: string[];
};

export type editUserState = {
  errors?: editUserError;
  message?: string | null;
};

export async function editUserAction(state: editUserState, formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    nickname: formData.get('nickname'),
    oldPassword: formData.get('oldPassword'),
    changePassword: Boolean(formData.get('changePassword')),
    newPassword: formData.get('newPassword'),
    confirmNewPassword: formData.get('confirmNewPassword'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '필수 항목이 누락되었습니다.',
    };
  }

  const { nickname, oldPassword, changePassword, newPassword } = validatedFields.data;

  if (changePassword && oldPassword === newPassword) {
    const errors: editUserError = {};
    errors.newPassword = [];
    errors.confirmNewPassword = ['이전 비밀번호와 동일합니다.'];
    return {
      errors,
    };
  }

  try {
    const session = await getSession();
    if (!session?.userId)
      return {
        message: '현재 로그인된 상태가 아닙니다.',
      };

    const userId = session.userId;
    const user = await findUserWithUserId(userId);
    if (!user)
      return {
        message: '회원정보를 찾지 못했습니다.',
      };

    const isValidPassword = await verifyPassword(oldPassword, user.password);
    if (!isValidPassword)
      return {
        errors: {
          oldPassword: ['비밀번호가 틀렸습니다.'],
        },
      };

    if (nickname !== user.nickname) {
      if (await isNicknameDuplicate(userId, nickname))
        return {
          errors: {
            nickname: ['이미 존재하는 닉네임입니다.'],
          },
        };

      await updateUserNickname(userId, nickname);
    }

    if (changePassword && newPassword) await updateUserPassword(userId, newPassword);

    if (nickname) await createSession({ ...session, nickname });
  } catch (error) {
    console.error(error);
    return {
      message: '회원정보 수정에 실패했습니다.',
    };
  }

  redirect('/');
}

export async function updateUserProfilePathAction(profilePath: string | null) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return {
        message: '현재 로그인된 상태가 아닙니다.',
      };
    }
    await updateUserProfilePath(session.userId, profilePath);
    await createSession({ ...session, profilePath });
  } catch (error) {
    console.log(error);
  }

  revalidatePath('/auth/edit');
}

export async function deleteProfileImage(deleteProfilePath: string) {
  try {
    const session = await getSession();
    if (!session?.userId) throw new Error('로그인 세션이 만료되었습니다.');

    const profilePath = await getUserProfilePath(session.userId);
    if (!profilePath) throw new Error('존재하지 않는 아이디입니다');

    if (deleteProfilePath !== profilePath) throw new Error('잘못된 프로필 이미지 삭제 요청');

    await deleteImage(deleteProfilePath);
  } catch (error) {
    console.log(error);
  }
}

export async function getSignedUrlForProfileImage(imagePath: string, fileType: string) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      throw new Error('로그인을 해주세요.');
    }

    const objectId = nanoid(USER_ID_LENGTH);
    const key = `profile/${objectId}${path.extname(imagePath)}`;
    const url = await getSignedUrlForImage(key, fileType);

    return {
      profilePath: key,
      url,
    };
  } catch (error) {
    console.log(error);
  }
}
