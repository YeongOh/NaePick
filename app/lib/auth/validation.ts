import { eq, or } from 'drizzle-orm';
import { db } from '../database';
import { user } from '../database/schema';

export async function findDuplicateEmailOrNickname(
  email: string,
  nickname: string
) {
  try {
    return await db
      .select({ nickname: user.nickname, email: user.email })
      .from(user)
      .where(or(eq(user.nickname, nickname), eq(user.email, email)));
  } catch (error) {
    console.error(error);
    throw error;
  }
}
