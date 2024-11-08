import 'server-only';
import { nanoid } from 'nanoid';
import { db } from '../database';
import { users } from '../database/schema';
import { hashPassword } from './utils';
import { USER_ID_LENGTH } from '@/app/constants';
import { eq } from 'drizzle-orm';

export async function createUser({
  email,
  nickname,
  password,
}: {
  email: string;
  nickname: string;
  password: string;
}) {
  try {
    const userId = nanoid(USER_ID_LENGTH);
    const hashedPassword = await hashPassword(password);

    await db.insert(users).values({ id: userId, password: hashedPassword, email, nickname });
    return userId;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function findUserWithEmail(email: string) {
  try {
    return await db
      .select({
        userId: users.id,
        nickname: users.nickname,
        profilePath: users.profilePath,
        password: users.password,
      })
      .from(users)
      .where(eq(users.email, email));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function findUserWithUserId(userId: string) {
  try {
    return await db
      .select({
        nickname: users.nickname,
        profilePath: users.profilePath,
        password: users.password,
      })
      .from(users)
      .where(eq(users.id, userId));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateUserNickname(userId: string, nickname: string) {
  try {
    await db.update(users).set({ nickname }).where(eq(users.id, userId));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateUserPassword(userId: string, password: string) {
  try {
    const hashedPassword = await hashPassword(password);
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateUserProfilePath(userId: string, profilePath: string | null) {
  try {
    await db.update(users).set({ profilePath }).where(eq(users.id, userId));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserProfilePath(userId: string) {
  try {
    return await db
      .select({
        profilePath: users.profilePath,
      })
      .from(users)
      .where(eq(users.id, userId));
  } catch (error) {
    console.error(error);
    throw error;
  }
}
