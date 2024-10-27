'use server';

import { FieldPacket } from 'mysql2';
import { Comment } from '../definitions';
import { pool } from '../db';

export async function getCommentsByWorldcupId(worldcupId: string) {
  try {
    const [result, meta]: [Comment[], FieldPacket[]] = await pool.query(
      `SELECT c.comment_id as commentId,
            c.user_id as userId,
            c.text as text,
            c.created_at as createdAt,
            c.updated_at as updatedAt,
            u.nickname as nickname
         FROM comment c
         LEFT JOIN user u ON u.user_id = c.user_id
         WHERE c.worldcup_id = ?;`,
      [worldcupId]
    );

    return result;
  } catch (err) {
    console.log(err);
  }
}
