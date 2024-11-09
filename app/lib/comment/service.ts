import 'server-only';

import { COMMENT_ID_LENGTH } from '@/app/constants';
import { db } from '../database';
import { nanoid } from 'nanoid';
import { comments } from '../database/schema';
import { eq } from 'drizzle-orm';

export async function createComment({
  worldcupId,
  text,
  userId,
  votedCandidateId,
}: {
  worldcupId: string;
  text: string;
  userId?: string;
  votedCandidateId?: string;
}) {
  try {
    const commentId = nanoid(COMMENT_ID_LENGTH);
    const values = {
      id: commentId,
      userId: userId ?? null,
      candidateId: votedCandidateId ?? null,
      isAnonymous: userId ? false : true,
      worldcupId,
      text,
    };
    await db.insert(comments).values(values);

    return commentId;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateComment(commentId: string, text: string) {
  try {
    await db.update(comments).set({ text }).where(eq(comments.id, commentId));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteComment(commentId: string) {
  try {
    await db.delete(comments).where(eq(comments.id, commentId));
  } catch (error) {
    console.error(error);
    throw error;
  }
}
