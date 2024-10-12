'use server';

import { revalidatePath } from 'next/cache';
import { deleteImage } from '../../images';
import { Candidate } from '../../definitions';
import { FieldPacket } from 'mysql2';
import { getSession } from '../session';
import getConnection from '../../db';
import { redirect } from 'next/navigation';

export async function deleteUserPost(postId: string, userId: string) {
  try {
    const session = await getSession();
    if (session.id !== userId) {
      console.log('권한 없음');
      return;
    }
    const connection = await getConnection();

    const [result, meta] = await connection.execute(
      `DELETE FROM Posts
          WHERE id = ?`,
      [postId]
    );

    await connection.execute(
      `DELETE FROM PostStats
          WHERE postid = ?`,
      [postId]
    );

    const [candidates, candidatesMeta]: [Candidate[], FieldPacket[]] =
      await connection.execute(
        `SELECT * FROM Candidates
          WHERE postid = ?`,
        [postId]
      );

    if (candidates) {
      const promises: Promise<void>[] = [];
      candidates.forEach(async (candidate: Candidate) =>
        promises.push(deleteImage(candidate.url))
      );
      const imageDeleteResult = await Promise.all(promises);
      console.log(imageDeleteResult);
    }

    await connection.execute(
      `DELETE FROM Candidates
          WHERE postid = ?`,
      [postId]
    );

    await connection.execute(
      `DELETE FROM Thumbnails
          WHERE postid = ?`,
      [postId]
    );

    await connection.execute(
      `DELETE FROM Comments
          WHERE postid = ?`,
      [postId]
    );
  } catch (err) {
    console.log(err);
  }
  revalidatePath(`/${userId}`);
  redirect(`/${userId}`);
}
