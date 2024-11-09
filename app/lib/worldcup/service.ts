import 'server-only';
import { candidates, users, worldcups } from '../database/schema';
import { nanoid } from 'nanoid';
import { WORLDCUP_ID_LENGTH } from '@/app/constants';
import { db } from '../database';
import { eq, getTableColumns } from 'drizzle-orm';

export async function createWorldcup({
  title,
  description,
  publicity,
  categoryId,
  userId,
}: {
  title: string;
  description: string | null;
  publicity: 'public' | 'private' | 'unlisted';
  categoryId: number;
  userId: string;
}) {
  try {
    const worldcupId = nanoid(WORLDCUP_ID_LENGTH);
    await db.insert(worldcups).values({ id: worldcupId, title, description, publicity, userId, categoryId });
    return worldcupId;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateWorldcup({
  worldcupId,
  title,
  description,
  publicity,
  categoryId,
}: {
  worldcupId: string;
  title: string;
  description: string | null;
  publicity: 'public' | 'private' | 'unlisted';
  categoryId: number;
}) {
  try {
    await db
      .update(worldcups)
      .set({ title, description, publicity, categoryId })
      .where(eq(worldcups.id, worldcupId));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getWorldcup(worldcupId: string) {
  try {
    const result = await db
      .select({
        ...getTableColumns(worldcups),
        nickname: users.nickname,
        profilePath: users.profilePath,
        candidatesCount: db.$count(candidates, eq(candidates.worldcupId, worldcupId)),
      })
      .from(worldcups)
      .leftJoin(users, eq(users.id, worldcups.userId))
      .where(eq(worldcups.id, worldcupId));

    return result[0] || null;
  } catch (error) {
    console.error(error);
  }
}

export async function getWorldcupForm(worldcupId: string) {
  try {
    const result = await db
      .select({
        id: worldcups.id,
        title: worldcups.title,
        description: worldcups.description,
        publicity: worldcups.publicity,
        categoryId: worldcups.categoryId,
        userId: worldcups.userId,
      })
      .from(worldcups)
      .where(eq(worldcups.id, worldcupId));

    return result[0] || null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteWorldcup(worldcupId: string) {
  try {
    await db.delete(worldcups).where(eq(worldcups.id, worldcupId));
  } catch (error) {
    console.error(error);
    throw error;
  }
}
