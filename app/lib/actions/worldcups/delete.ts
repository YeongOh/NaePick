'use server';

import { revalidatePath } from 'next/cache';
import { Candidate } from '../../definitions';
import { FieldPacket } from 'mysql2';
import { getSession } from '../session';
import { pool } from '../../db';
import { redirect } from 'next/navigation';

export async function deleteUserPost(postId: string, userId: string) {
  const connection = await pool.getConnection();

  try {
    const session = await getSession();
    if (session.userId !== userId) {
      return;
    }

    const [result, meta] = await connection.query(
      `DELETE FROM Posts
          WHERE id = ?`,
      [postId]
    );

    await connection.query(
      `DELETE FROM PostStats
          WHERE postid = ?`,
      [postId]
    );

    const [candidates, candidatesMeta]: [Candidate[], FieldPacket[]] =
      await connection.query(
        `SELECT * FROM Candidates
          WHERE postid = ?`,
        [postId]
      );

    if (candidates) {
      const promises: Promise<void>[] = [];
      const imageDeleteResult = await Promise.all(promises);
    }

    await connection.query(
      `DELETE FROM Candidates
          WHERE postid = ?`,
      [postId]
    );

    await connection.query(
      `DELETE FROM Thumbnails
          WHERE postid = ?`,
      [postId]
    );

    await connection.query(
      `DELETE FROM Comments
          WHERE postid = ?`,
      [postId]
    );

    connection.commit();
  } catch (err) {
    console.log(err);
    connection.rollback();
  }
  revalidatePath(`/${userId}`);
  redirect(`/${userId}`);
}
