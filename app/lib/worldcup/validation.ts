import { and, eq } from 'drizzle-orm';
import { db } from '../database';
import { worldcupFavourites } from '../database/schema';

export async function isWorldcupFavouriteDuplicate(worldcupId: string, userId: string) {
  try {
    const result = await db
      .select({ worldcupId: worldcupFavourites.worldcupId })
      .from(worldcupFavourites)
      .where(and(eq(worldcupFavourites.worldcupId, worldcupId), eq(worldcupFavourites.userId, userId)));
    if (result.length === 1) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
