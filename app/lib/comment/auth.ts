import 'server-only';
import { db } from '../database';
import { comments } from '../database/schema';
import { eq } from 'drizzle-orm';

export async function verifyCommentOwner(commentId: string, userId: string) {
  try {
    const [comment] = await db
      .select({ userId: comments.userId })
      .from(comments)
      .where(eq(comments.id, commentId));

    if (comment.userId !== userId) return false;

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
