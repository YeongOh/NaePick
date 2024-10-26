import { FieldPacket } from 'mysql2/promise';
import { WorldcupCard, Thumbnail, Worldcup, Category } from '../definitions';
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
              cm1.url AS leftCandidateUrl, cm2.url AS rightCandidateUrl,
              u.nickname as nickname, 
              (SELECT COUNT(c.candidate_id) 
              FROM candidate c
              WHERE c.worldcup_id = w.worldcup_id) AS numberOfCandidates
      FROM worldcup w
      LEFT JOIN user u ON w.user_id = u.user_id
      LEFT JOIN thumbnail t ON t.worldcup_id = w.worldcup_id
      LEFT JOIN candidate c1 ON c1.candidate_id = t.left_candidate_id
      LEFT JOIN candidate_media cm1 ON cm1.candidate_id = c1.candidate_id
      LEFT JOIN candidate c2 ON c2.candidate_id = t.right_candidate_id
      LEFT JOIN candidate_media cm2 ON cm2.candidate_id = c2.candidate_id
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
    const [result, meta]: [WorldcupCard[], FieldPacket[]] = await pool.query(
      `SELECT w.worldcup_id as worldcupId,
              w.title,
              w.description,
              w.publicity, 
              w.created_at AS createdAt,
              u.user_id AS userId,
              c1.name AS leftCandidateName, c2.name AS rightCandidateName, 
              cm1.url AS leftCandidateUrl, cm2.url AS rightCandidateUrl,
              u.nickname as nickname, 
              (SELECT COUNT(c.candidate_id) 
              FROM candidate c
              WHERE c.worldcup_id = w.worldcup_id) AS numberOfCandidates
      FROM worldcup w
      LEFT JOIN user u ON w.user_id = u.user_id
      LEFT JOIN thumbnail t ON t.worldcup_id = w.worldcup_id
      LEFT JOIN candidate c1 ON c1.candidate_id = t.left_candidate_id
      LEFT JOIN candidate_media cm1 ON cm1.candidate_id = c1.candidate_id
      LEFT JOIN candidate c2 ON c2.candidate_id = t.right_candidate_id
      LEFT JOIN candidate_media cm2 ON cm2.candidate_id = c2.candidate_id
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
              w.user_id as userId,
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
    const [result, meta]: [WorldcupCard[], FieldPacket[]] = await pool.query(
      `SELECT w.worldcup_id as worldcupId,
              w.title,
              w.description,
              w.publicity, 
              w.created_at AS createdAt,
              w.user_id AS userId,
              u.nickname as nickname, 
              c1.name AS leftCandidateName,
              c2.name AS rightCandidateName, 
              cm1.url AS leftCandidateUrl,
              cm2.url AS rightCandidateUrl,
              (SELECT COUNT(c.candidate_id) 
              FROM candidate c
              WHERE c.worldcup_id = w.worldcup_id) AS numberOfCandidates
      FROM worldcup w
      LEFT JOIN thumbnail t ON t.worldcup_id = w.worldcup_id
      LEFT JOIN candidate c1 ON c1.candidate_id = t.left_candidate_id
      LEFT JOIN candidate_media cm1 ON cm1.candidate_id = c1.candidate_id
      LEFT JOIN candidate c2 ON c2.candidate_id = t.right_candidate_id
      LEFT JOIN candidate_media cm2 ON cm2.candidate_id = c2.candidate_id
      LEFT JOIN user u ON w.user_id = u.user_id
      WHERE w.user_id = ?;`,
      [userId]
    );
    console.log(result);

    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function fetchAllCategories() {
  try {
    const [result, meta]: [Category[], FieldPacket[]] = await pool.query(
      `SELECT category_id as categoryId,
              name as name
      FROM category;`
    );

    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function fetchWorldcupInfoFormByWorldcupId(worldcupId: string) {
  try {
    const [result, meta]: [Worldcup[], FieldPacket[]] = await pool.query(
      `SELECT worldcup_id as worldcupId,
              user_id as userId, category_id as categoryId,
              title, description, publicity
       FROM worldcup
       WHERE worldcup_id = ?;`,
      [worldcupId]
    );

    return result;
  } catch (err) {
    console.log(err);
  }
}
