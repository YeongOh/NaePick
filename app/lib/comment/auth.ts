import 'server-only';
import { eq } from 'drizzle-orm';

import { db } from '../database';
import { comments } from '../database/schema';

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
