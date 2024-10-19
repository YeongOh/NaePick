import { FieldPacket } from 'mysql2/promise';
import {
  Comment,
  WorldcupCard,
  PostInfo,
  Thumbnail,
  Worldcup,
} from '../definitions';
import { pool } from '../db';

export async function fetchPublicWorldcupCards() {
  try {
    const [result, meta]: [WorldcupCard[], FieldPacket[]] = await pool.query(
      `SELECT w.worldcup_id as worldcupId,
              w.title,
              w.description,
              w.publicity, 
              w.created_at AS createdAt,
              c1.name AS leftCandidateName, c2.name AS rightCandidateName, 
              c1.url AS leftCandidateUrl, c2.url AS rightCandidateUrl,
              u.nickname as nickname, 
              (SELECT COUNT(c.candidate_id) 
              FROM candidate c
              WHERE c.worldcup_id = w.worldcup_id) AS numberOfCandidates
      FROM worldcup w
      JOIN user u ON w.user_id = u.user_id
      JOIN thumbnail t ON t.worldcup_id = w.worldcup_id
      JOIN candidate c1 ON c1.candidate_id = t.left_candidate_id
      JOIN candidate c2 ON c2.candidate_id = t.right_candidate_id
      WHERE w.publicity = 'public'
      ORDER BY w.created_at DESC;`
    );
    console.log(result);

    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function fetchWorldcupCardByWorldcupId(worldcupId: string) {
  try {
    const [result, meta]: [
      Omit<WorldcupCard[], 'userId' | 'categoryId'>,
      FieldPacket[]
    ] = await pool.query(
      `SELECT w.worldcup_id as worldcupId,
              w.title,
              w.description,
              w.publicity, 
              w.created_at AS createdAt,
              c1.name AS leftCandidateName, c2.name AS rightCandidateName, 
              c1.url AS leftCandidateUrl, c2.url AS rightCandidateUrl,
              u.nickname as nickname, 
              (SELECT COUNT(c.candidate_id) 
              FROM candidate c
              WHERE c.worldcup_id = w.worldcup_id) AS numberOfCandidates
      FROM worldcup w
      JOIN user u ON w.user_id = u.user_id
      JOIN thumbnail t ON t.worldcup_id = w.worldcup_id
      JOIN candidate c1 ON c1.candidate_id = t.left_candidate_id
      JOIN candidate c2 ON c2.candidate_id = t.right_candidate_id
      WHERE w.worldcup_id = ?;`,
      [worldcupId]
    );
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function fetchWorldcupByWorldcupId(worldcupId: string) {
  try {
    const [result, meta]: [
      Omit<Worldcup[], 'categoryId'> & {
        nickname: string;
        categoryName: string;
      },
      FieldPacket[]
    ] = await pool.query(
      `SELECT w.worldcup_id as worldcupId,
              w.title,
              w.description,
              w.publicity, 
              w.created_at AS createdAt,
              u.nickname as nickname,
              ct.name as categoryName,
              (SELECT COUNT(c.candidate_id) 
              FROM candidate c
              WHERE c.worldcup_id = w.worldcup_id) AS numberOfCandidates
      FROM worldcup w
      JOIN category ct ON ct.category_id = w.category_id
      JOIN user u ON w.user_id = u.user_id
      WHERE w.worldcup_id = ?;`,
      [worldcupId]
    );
    console.log(result);

    return result;
  } catch (err) {
    console.log(err);
  }
}

// TODO:
export async function fetchWorldcupsByUserId(userId: string) {
  try {
    const [result, meta]: [WorldcupCard[] & Thumbnail[], FieldPacket[]] =
      await pool.query(
        `SELECT p.*, c1.name as leftCandidateName, c2.name as rightCandidateName, 
              c1.url as leftCandidateUrl, c2.url as rightCandidateUrl,
              u.nickname as nickname, u.username as username,
              ct.name as categoryName
      FROM Posts p 
      LEFT JOIN Thumbnails t ON p.id = t.postId
      LEFT JOIN Candidates c1 ON t.leftCandidateId = c1.id
      LEFT JOIN Candidates c2 ON t.rightCandidateId = c2.id
      LEFT JOIN Categories ct ON p.categoryId = ct.id
      LEFT JOIN Users u ON p.userId = u.id
      WHERE p.userId = ?
      ORDER BY p.createdAt DESC 
      LIMIT 12;`,
        [userId]
      );

    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function fetchAllCategories() {
  try {
    const result: any = await pool.query(
      `SELECT category_id as categoryId,
              name as name
      FROM category;`
    );

    return result[0];
  } catch (err) {
    console.log(err);
  }
}

// TODO:
export async function fetchWorldcupWithThumbnailByWorldcupId(id: string) {
  try {
    const [result, meta]: [
      PostInfo[] & { leftCandidateId: string; rightCandidateId: string },
      FieldPacket[]
    ] = await pool.query(
      `SELECT p.*, c.name AS categoryName,
            u.nickname as nickname,
            t.leftCandidateId as leftCandidateId,
            t.rightCandidateId as rightCandidateId,
            u.username as username 
       FROM Posts p
       LEFT JOIN Thumbnails t ON p.id = t.postId
       LEFT JOIN Categories c ON p.categoryId = c.id
       LEFT JOIN Users u ON p.userId = u.id
       WHERE p.id = ?;`,
      [id]
    );

    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function fetchCommentsByWorldcupId(worldcupId: string) {
  try {
    const [result, meta]: [Comment[], FieldPacket[]] = await pool.query(
      `SELECT c.*, 
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
