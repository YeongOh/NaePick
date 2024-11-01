'use server';

import { FieldPacket } from 'mysql2/promise';
import { WorldcupCard, Worldcup, Category } from '../definitions';
import { pool } from '../db';

export async function getPublicWorldcupCards(pageNumber: number) {
  try {
    const [result, meta]: [WorldcupCard[], FieldPacket[]] = await pool.query(
      `SELECT w.worldcup_id as worldcupId,
              w.title as title,
              w.description as description,
              w.publicity, 
              w.created_at AS createdAt,
              u.nickname as nickname,
        
              lc.name AS leftCandidateName,
              lmt.type AS leftCandidateMediaType,
              lcm.pathname AS leftCandidatePathname,
              lcm.thumbnail_url AS leftCandidateThumbnailURL,

              rc.name AS rightCandidateName,
              rmt.type AS rightCandidateMediaType,
              rcm.pathname AS rightCandidatePathname,
              rcm.thumbnail_url AS rightCandidateThumbnailURL

              FROM worldcup w

              LEFT JOIN user u ON w.user_id = u.user_id
              
              LEFT JOIN LATERAL (
                SELECT mr.winner_candidate_id AS candidate_id
                FROM match_result mr
                WHERE mr.worldcup_id = w.worldcup_id 
                AND mr.is_final_match = 1
                GROUP BY mr.winner_candidate_id
                ORDER BY COUNT(*) DESC
                LIMIT 1) AS lmr ON TRUE
              LEFT JOIN candidate AS lc ON lc.candidate_id = lmr.candidate_id
              LEFT JOIN candidate_media AS lcm ON lcm.candidate_id = lc.candidate_id
              LEFT JOIN media_type AS lmt ON lcm.media_type_id = lmt.media_type_id

              LEFT JOIN LATERAL (
              SELECT mr.winner_candidate_id AS candidate_id
                FROM match_result mr
                WHERE mr.worldcup_id = w.worldcup_id
                AND mr.is_final_match = 1 
                GROUP BY mr.winner_candidate_id
                ORDER BY COUNT(*) DESC
              LIMIT 1 OFFSET 1) AS rmr ON TRUE 
              LEFT JOIN candidate AS rc ON rc.candidate_id = rmr.candidate_id
              LEFT JOIN candidate_media AS rcm ON rcm.candidate_id = rc.candidate_id
              LEFT JOIN media_type AS rmt ON rcm.media_type_id = rmt.media_type_id

              WHERE w.publicity = 'public'
              ORDER BY w.created_at DESC
              LIMIT 6 OFFSET ?;`,
      [(pageNumber - 1) * 6]
    );

    if (result.length != 0) {
      return { data: result, hasNextPage: true };
    } else {
      return { data: null, hasNextPage: false };
    }
  } catch (err) {
    console.log(err);
  }
}

export async function getWorldcupCardByWorldcupId(worldcupId: string) {
  try {
    const [result, meta]: [WorldcupCard[], FieldPacket[]] = await pool.query(
      `SELECT w.worldcup_id as worldcupId,
              w.title as title,
              w.description as description,
              w.publicity, 
              w.created_at AS createdAt,
              u.user_id AS userId,
              u.nickname AS nickname,
        
              lc.name AS leftCandidateName,
              lmt.type AS leftCandidateMediaType,
              lcm.pathname AS leftCandidatePathname,
              lcm.thumbnail_url AS leftCandidateThumbnailURL,

              rc.name AS rightCandidateName,
              rmt.type AS rightCandidateMediaType,
              rcm.pathname AS rightCandidatePathname,
              rcm.thumbnail_url AS rightCandidateThumbnailURL

              FROM worldcup w

              LEFT JOIN user u ON w.user_id = u.user_id
              
              LEFT JOIN LATERAL (
                SELECT mr.winner_candidate_id AS candidate_id
                FROM match_result mr
                WHERE mr.worldcup_id = w.worldcup_id 
                AND mr.is_final_match = 1
                GROUP BY mr.winner_candidate_id
                ORDER BY COUNT(*) DESC
                LIMIT 1) AS lmr ON TRUE
              LEFT JOIN candidate AS lc ON lc.candidate_id = lmr.candidate_id
              LEFT JOIN candidate_media AS lcm ON lcm.candidate_id = lc.candidate_id
              LEFT JOIN media_type AS lmt ON lcm.media_type_id = lmt.media_type_id

              LEFT JOIN LATERAL (
              SELECT mr.winner_candidate_id AS candidate_id
                FROM match_result mr
                WHERE mr.worldcup_id = w.worldcup_id
                AND mr.is_final_match = 1 
                GROUP BY mr.winner_candidate_id
                ORDER BY COUNT(*) DESC
              LIMIT 1 OFFSET 1) AS rmr ON TRUE 
              LEFT JOIN candidate AS rc ON rc.candidate_id = rmr.candidate_id
              LEFT JOIN candidate_media AS rcm ON rcm.candidate_id = rc.candidate_id
              LEFT JOIN media_type AS rmt ON rcm.media_type_id = rmt.media_type_id

              WHERE w.worldcup_id = ?;`,
      [worldcupId]
    );
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function getWorldcupPickScreenByWorldcupId(worldcupId: string) {
  try {
    const [result, meta]: [Worldcup[], FieldPacket[]] = await pool.query(
      `SELECT w.worldcup_id as worldcupId,
              w.title,
              w.description,
              w.publicity, 
              w.created_at AS createdAt,
              w.updated_at AS updatedAt,
              u.nickname as nickname,
              w.user_id as userId,
              ct.name as categoryName,
              (SELECT COUNT(c.candidate_id) 
              FROM candidate c
              WHERE c.worldcup_id = w.worldcup_id) AS numberOfCandidates
      FROM worldcup w
      LEFT JOIN category ct ON ct.category_id = w.category_id
      LEFT JOIN user u ON w.user_id = u.user_id
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
export async function getWorldcupsByUserId(userId: string) {
  try {
    const [result, meta]: [WorldcupCard[], FieldPacket[]] = await pool.query(
      `SELECT w.worldcup_id as worldcupId,
              w.title as title,
              w.description as description,
              w.publicity, 
              w.created_at AS createdAt,
              u.nickname as nickname,
        
              lc.name AS leftCandidateName,
              lmt.type AS leftCandidateMediaType,
              lcm.pathname AS leftCandidatePathname,
              lcm.thumbnail_url AS leftCandidateThumbnailURL,

              rc.name AS rightCandidateName,
              rmt.type AS rightCandidateMediaType,
              rcm.pathname AS rightCandidatePathname,
              rcm.thumbnail_url AS rightCandidateThumbnailURL

              FROM worldcup w

              LEFT JOIN user u ON w.user_id = u.user_id
              
              LEFT JOIN LATERAL (
                SELECT mr.winner_candidate_id AS candidate_id
                FROM match_result mr
                WHERE mr.worldcup_id = w.worldcup_id 
                AND mr.is_final_match = 1
                GROUP BY mr.winner_candidate_id
                ORDER BY COUNT(*) DESC
                LIMIT 1) AS lmr ON TRUE
              LEFT JOIN candidate AS lc ON lc.candidate_id = lmr.candidate_id
              LEFT JOIN candidate_media AS lcm ON lcm.candidate_id = lc.candidate_id
              LEFT JOIN media_type AS lmt ON lcm.media_type_id = lmt.media_type_id

              LEFT JOIN LATERAL (
              SELECT mr.winner_candidate_id AS candidate_id
                FROM match_result mr
                WHERE mr.worldcup_id = w.worldcup_id
                AND mr.is_final_match = 1 
                GROUP BY mr.winner_candidate_id
                ORDER BY COUNT(*) DESC
              LIMIT 1 OFFSET 1) AS rmr ON TRUE 
              LEFT JOIN candidate AS rc ON rc.candidate_id = rmr.candidate_id
              LEFT JOIN candidate_media AS rcm ON rcm.candidate_id = rc.candidate_id
              LEFT JOIN media_type AS rmt ON rcm.media_type_id = rmt.media_type_id

              WHERE u.user_id = ?
              ORDER BY w.created_at DESC;`,
      [userId]
    );

    console.log(result);

    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function getAllCategories() {
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

export async function getWorldcupInfoFormByWorldcupId(worldcupId: string) {
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
