import 'server-only';
import { and, eq, ne, or } from 'drizzle-orm';

import { db } from '../database';
import { users } from '../database/schema';

export async function findUserWithDuplicateEmailOrNickname(email: string, nickname: string) {
  try {
    return await db
      .select({ nickname: users.nickname, email: users.email })
      .from(users)
      .where(or(eq(users.nickname, nickname), eq(users.email, email)));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function isNicknameDuplicate(userId: string, nickname: string) {
  try {
    const user = await db.query.users.findFirst({
      columns: {
        id: true,
      },
      where: and(eq(users.nickname, nickname), ne(users.id, userId)),
    });

    if (user) return true;

    return false;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
