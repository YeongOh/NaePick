import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from '../database';
import { worldcups } from '../database/schema';

export async function verifyWorldcupOwner(worldcupId: string, userId: string) {
  try {
    const result = await db
      .select({ ownerId: worldcups.userId })
      .from(worldcups)
      .where(eq(worldcups.id, worldcupId));
    if (!result.length) return false;

    if (result[0].ownerId === userId) return true;

    return false;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
