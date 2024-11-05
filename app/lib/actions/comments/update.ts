'use server';

import { revalidatePath } from 'next/cache';
import { Comment } from '../../definitions';
import { getSession } from '../session';
import { FieldPacket } from 'mysql2';
import { pool } from '../../db';

export async function updateComment(commentId: string, newText: string) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      throw new Error('로그인 세션이 만료되었습니다.');
    }

    const [commentFound, meta]: [Comment[], FieldPacket[]] = await pool.query(
      `SELECT user_id as userId 
              FROM comment
              WHERE comment_id = ?`,
      [commentId]
    );

    if (!commentFound || !commentFound[0]) {
      throw new Error('존재하지 않는 댓글입니다.');
    }
    if (commentFound[0].userId !== session.userId) {
      throw new Error('삭제할 수 없는 댓글입니다.');
    }

    const [result, fields] = await pool.query(
      `UPDATE comment
       SET text = ?
       WHERE comment_id = ?
            `,
      [newText, commentId]
    );
  } catch (error) {
    console.log(error);
    throw new Error('댓글 삭제 실패...');
  }
  revalidatePath('');
}
