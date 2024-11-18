'use server';

import path from 'path';

import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { USER_ID_LENGTH } from '@/app/constants';
import {
  deleteAccount,
  findUserWithUserId,
  getUserProfilePath,
  updateUserNickname,
  updateUserPassword,
  updateUserProfilePath,
} from '@/app/lib/auth/service';
import { verifyPassword } from '@/app/lib/auth/utils';
import { isNicknameDuplicate } from '@/app/lib/auth/validation';
import { createSession, getSession } from '@/app/lib/session';
import { deleteImage, getSignedUrlForImage } from '@/app/lib/storage';

import { EditFormSchema, TEditFormSchema } from './types';

export async function editUserAction(data: TEditFormSchema) {
  const validatedFields = EditFormSchema.safeParse(data);

  if (!validatedFields.success) {
    let parseError = {};
    validatedFields.error.issues.forEach((issue) => {
      parseError = { ...parseError, [issue.path[0]]: issue.message };
    });
    return {
      errors: parseError,
    };
  }

  const { nickname, oldPassword, newPassword } = validatedFields.data;

  try {
    const session = await getSession();
    if (!session?.userId)
      return {
        errors: { session: '현재 로그인된 상태가 아닙니다.' },
      };

    const userId = session.userId;
    const user = await findUserWithUserId(userId);
    if (!user)
      return {
        errors: { userId: '회원정보를 찾지 못했습니다.' },
      };

    const isValidPassword = await verifyPassword(oldPassword, user.password);
    if (!isValidPassword)
      return {
        errors: {
          oldPassword: '비밀번호가 틀렸습니다.',
        },
      };

    if (nickname !== user.nickname) {
      if (await isNicknameDuplicate(userId, nickname))
        return {
          errors: {
            nickname: '이미 존재하는 닉네임입니다.',
          },
        };

      await updateUserNickname(userId, nickname);
    }

    if (newPassword) await updateUserPassword(userId, newPassword);

    if (nickname) await createSession({ ...session, nickname });
  } catch (error) {
    console.error(error);
    return {
      errors: { server: '서버 문제로 인해 회원 정보 수정에 실패하였습니다.' },
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

export async function deleteAccountAction() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      throw new Error('세션이 만료되었습니다.');
    }

    await deleteAccount(session.userId);
  } catch (error) {
    console.log(error);
  }
}
