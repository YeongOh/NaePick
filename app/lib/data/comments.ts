'use server';

import { FieldPacket } from 'mysql2';
import { Comment, InfiniteScrollData } from '../definitions';
import { pool } from '../db';

export async function getCommentsByWorldcupId(
  worldcupId: string,
  cursor?: string
) {
  try {
    const [result, meta]: [Comment[], FieldPacket[]] = await pool.query(
      `SELECT c.comment_id as commentId,
            c.user_id as userId,
            c.text as text,
            c.created_at as createdAt,
            c.updated_at as updatedAt,
            u.nickname as nickname,
            c.is_anonymous as isAnonymous,
            ca.name as votedFor
         FROM comment c
         LEFT JOIN user u ON u.user_id = c.user_id
         LEFT JOIN candidate ca ON ca.candidate_id = c.voted_candidate_id
         WHERE c.worldcup_id = ? AND c.created_at < ?
         ORDER BY c.created_at DESC
         LIMIT 20;`,
      [worldcupId, cursor || new Date()]
    );
    console.log(result);

    if (result.length === 0) {
      const infiniteScrollData: InfiniteScrollData<Comment, string> = {
        data: null,
        cursor: null,
      };
      return infiniteScrollData;
    } else {
      const lastTimestamp = result.at(-1)?.createdAt || null;
      const infiniteScrollData: InfiniteScrollData<Comment, string> = {
        data: result,
        cursor: lastTimestamp,
      };
      return infiniteScrollData;
    }
  } catch (err) {
    console.log(err);
  }
}
