import { nanoid } from 'nanoid';
import { db } from '../database';
import { user } from '../database/schema';
import { hashPassword } from './utils';
import { USER_ID_LENGTH } from '@/app/constants';

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
    await db
      .insert(user)
      .values({ id: userId, password: hashedPassword, email, nickname });
    return userId;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
