'use server';

import { FieldPacket } from 'mysql2/promise';
import {
  WorldcupCard,
  Worldcup,
  Category,
  InfiniteScrollData,
} from '../definitions';
import { pool } from '../db';

export async function getInfinitePopularWorldcupCards(cursor: number | null) {
  try {
    const [result, meta]: [WorldcupCard[], FieldPacket[]] = await pool.query(
      `SELECT w.worldcup_id as worldcupId,
              w.title as title,
              w.description as description,
              w.publicity, 
              w.created_at AS createdAt,
              u.nickname as nickname,
              u.profile_pathname as profilePathname,
        
              lc.name AS leftCandidateName,
              lmt.type AS leftCandidateMediaType,
              lcm.pathname AS leftCandidatePathname,
              lcm.thumbnail_url AS leftCandidateThumbnailURL,

              rc.name AS rightCandidateName,
              rmt.type AS rightCandidateMediaType,
              rcm.pathname AS rightCandidatePathname,
              rcm.thumbnail_url AS rightCandidateThumbnailURL,

              COALESCE(mrc.match_count, 0) AS matchCount

              FROM worldcup w

              LEFT JOIN 
                (SELECT mr.worldcup_id, count(mr.worldcup_id) AS match_count FROM match_result mr
	              GROUP BY mr.worldcup_id) mrc ON w.worldcup_id = mrc.worldcup_id

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
              ORDER BY mrc.match_count DESC, w.created_At DESC
              LIMIT 20 OFFSET ?;`,
      [(cursor || 0) * 20]
    );

    if (result.length === 0) {
      const infiniteScrollData: InfiniteScrollData<WorldcupCard, number> = {
        data: null,
        cursor: null,
      };
      return infiniteScrollData;
    } else {
      const infiniteScrollData: InfiniteScrollData<WorldcupCard, number> = {
        data: result,
        cursor: (cursor || 0) + 1,
      };
      return infiniteScrollData;
    }
  } catch (err) {
    console.log(err);
  }
}

export async function getInfinitePopularWorldcupCardsByCategory(
  cursor: number | null,
  categoryName: string
) {
  try {
    const [result, meta]: [WorldcupCard[], FieldPacket[]] = await pool.query(
      `SELECT w.worldcup_id as worldcupId,
              w.title as title,
              w.description as description,
              w.publicity, 
              w.created_at AS createdAt,
              u.nickname as nickname,
              u.profile_pathname as profilePathname,
              c.name as categoryName,
        
              lc.name AS leftCandidateName,
              lmt.type AS leftCandidateMediaType,
              lcm.pathname AS leftCandidatePathname,
              lcm.thumbnail_url AS leftCandidateThumbnailURL,

              rc.name AS rightCandidateName,
              rmt.type AS rightCandidateMediaType,
              rcm.pathname AS rightCandidatePathname,
              rcm.thumbnail_url AS rightCandidateThumbnailURL,

              COALESCE(mrc.match_count, 0) AS matchCount

              FROM worldcup w

              LEFT JOIN 
                (SELECT mr.worldcup_id, count(mr.worldcup_id) AS match_count FROM match_result mr
	              GROUP BY mr.worldcup_id) mrc ON w.worldcup_id = mrc.worldcup_id
              
              JOIN category c ON w.category_id = c.category_id AND c.name = ?

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
              ORDER BY mrc.match_count DESC, w.created_at DESC
	            LIMIT 20 OFFSET ?`,
      [categoryName, (cursor || 0) * 20]
    );

    if (result.length === 0) {
      const infiniteScrollData: InfiniteScrollData<WorldcupCard, number> = {
        data: null,
        cursor: null,
      };
      return infiniteScrollData;
    } else {
      const infiniteScrollData: InfiniteScrollData<WorldcupCard, number> = {
        data: result,
        cursor: (cursor || 0) + 1,
      };
      return infiniteScrollData;
    }
  } catch (err) {
    console.log(err);
  }
}

export async function getInfiniteLatestWorldcupCards(cursor: string | null) {
  try {
    const [result, meta]: [WorldcupCard[], FieldPacket[]] = await pool.query(
      `SELECT w.worldcup_id as worldcupId,
              w.title as title,
              w.description as description,
              w.publicity, 
              w.created_at AS createdAt,
              u.nickname as nickname,
              u.profile_pathname as profilePathname,
        
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

              WHERE w.publicity = 'public' AND w.created_at < ?
              ORDER BY w.created_at DESC
              LIMIT 20;`,
      [cursor || new Date()]
    );

    if (result.length === 0) {
      const infiniteScrollData: InfiniteScrollData<WorldcupCard, string> = {
        data: null,
        cursor: null,
      };
      return infiniteScrollData;
    } else {
      const lastTimestamp = result.at(-1)?.createdAt || null;
      const infiniteScrollData: InfiniteScrollData<WorldcupCard, string> = {
        data: result,
        cursor: lastTimestamp,
      };
      return infiniteScrollData;
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
              u.profile_pathname as profilePathname,
              u.nickname AS nickname,

              (SELECT COUNT(c.candidate_id) 
              FROM candidate c
              WHERE c.worldcup_id = w.worldcup_id) AS numberOfCandidates,
        
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
              u.profile_pathname as profilePathname,
              w.user_id as userId,
              ct.name as categoryName,
              (SELECT COUNT(c.candidate_id) 
              FROM candidate c
              WHERE c.worldcup_id = w.worldcup_id) AS numberOfCandidates,
              (SELECT COUNT(cm.comment_id) 
              FROM comment cm
              WHERE cm.worldcup_id = w.worldcup_id) AS numberOfComments
      FROM worldcup w
      LEFT JOIN category ct ON ct.category_id = w.category_id
      LEFT JOIN user u ON w.user_id = u.user_id
      WHERE w.worldcup_id = ?;`,
      [worldcupId]
    );

    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function getWorldcupPageCountByUserId(
  userId: string
): Promise<number> {
  try {
    const [result]: [{ count: number }[], FieldPacket[]] = await pool.query(
      `SELECT COUNT(*) AS count
       FROM worldcup w
       WHERE w.user_id = ?;`,
      [userId]
    );

    const totalItems = result[0].count;
    const itemsPerPage = 10;
    const pageCount = Math.ceil(totalItems / itemsPerPage);

    return pageCount;
  } catch (err) {
    console.log(err);
    return 0;
  }
}

export async function getPaginationWorldcupsByUserId(
  pageNumber: number,
  userId: string
) {
  try {
    const [result, meta]: [WorldcupCard[], FieldPacket[]] = await pool.query(
      `SELECT w.worldcup_id as worldcupId,
              w.title as title,
              w.description as description,
              w.publicity, 
              w.created_at AS createdAt,
              u.nickname as nickname,
              u.profile_pathname as profilePathname,
        
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
              ORDER BY w.created_at DESC
              LIMIT 10 OFFSET ?;`,
      [userId, (pageNumber - 1) * 10]
    );

    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function getAllCategories() {
  try {
    const [result, meta]: [
      (Category & { categoryCount: number })[],
      FieldPacket[]
    ] = await pool.query(
      `SELECT c.category_id as categoryId,
              c.name as name,
              COALESCE(wc.category_count, 0) as categoryCount
      FROM category c
      LEFT JOIN
       (SELECT w.category_id, count(w.category_id) AS category_count
       FROM worldcup w GROUP BY w.category_id) wc on wc.category_id = c.category_id;`
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
