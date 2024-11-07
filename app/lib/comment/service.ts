import 'server-only';

import { COMMENT_ID_LENGTH } from '@/app/constants';
import { pool } from '../database';
import { nanoid } from 'nanoid';

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

    let votedFor = null;

    if (votedCandidateId) {
      const [result, fields] = await pool.query(
        `SELECT name FROM candidate WHERE candidate_id = ?`,
        [votedCandidateId]
      );
      if (result && result[0]) {
        votedFor = result[0].name;
      }
    }
    const isAnonymous = userId ? false : true;

    await pool.query(
      `INSERT INTO comment (comment_id, worldcup_id, user_id, text, is_anonymous, voted_candidate_id) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        commentId,
        worldcupId,
        isAnonymous ? null : userId,
        text,
        isAnonymous,
        votedCandidateId,
      ]
    );
    const newComment = {
      userId: isAnonymous ? null : userId,
      createdAt: String(new Date()),
      updatedAt: String(new Date()),
      worldcupId,
      commentId,
      text,
      votedFor,
      isAnonymous,
    };
    return newComment;
  } catch (error) {
    console.error(error);
    throw new Error('Server Error');
  }
}

export async function deleteComment(commentId: string) {
  try {
    await pool.query(
      `DELETE FROM comment
            WHERE comment_id = ?`,
      [commentId]
    );
  } catch (error) {
    console.error(error);
    throw new Error('Server Error');
  }
}

export async function updateComment({
  commentId,
  text,
}: {
  commentId: string;
  text: string;
}) {
  try {
    await pool.query(
      `UPDATE comment
       SET text = ?
       WHERE comment_id = ?`,
      [text, commentId]
    );
  } catch (error) {
    console.error(error);
    throw new Error('Server Error');
  }
}
