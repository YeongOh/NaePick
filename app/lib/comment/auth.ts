import 'server-only';
import { Comment } from '../types';
import { FieldPacket } from 'mysql2';
import { db } from '../database';

export const canUserEditComment = async ({
  userId,
  commentId,
}: {
  userId: string;
  commentId: string;
}) => {
  const [result, meta]: [Comment[], FieldPacket[]] = await db.query(
    `SELECT user_id as userId 
                FROM comment
                WHERE comment_id = ?`,
    [commentId]
  );
  if (!result || !result[0]) return false;

  const comment = result[0];
  if (comment.userId !== userId) return false;

  return true;
};
