'use server';

import { FieldPacket } from 'mysql2';
import { CandidateWithStatistics } from '../definitions';
import { pool } from '../db';

export async function getCandidateStatisticsByWorldcupId(worldcupId: string) {
  try {
    const [result, meta]: [CandidateWithStatistics[], FieldPacket[]] =
      await pool.query(
        `SELECT c.candidate_id AS candidateId, 
            c.name as name,
            cm.pathname AS pathname,
            cm.thumbnail_url AS thumbnailURL,
            m.type AS mediaType,
            (SELECT COUNT(*)
             FROM match_result mr
             WHERE mr.winner_candidate_id = c.candidate_id) AS numberOfWins,
             (SELECT COUNT(*)
             FROM match_result mr
             WHERE mr.loser_candidate_id = c.candidate_id) AS numberOfLosses,
             (SELECT COUNT(*)
             FROM match_result mr
             WHERE mr.winner_candidate_id = c.candidate_id AND mr.is_final_match IS TRUE) AS numberOfTrophies
          FROM candidate c
          JOIN candidate_media cm ON cm.candidate_id = c.candidate_id
          JOIN media_type m ON m.media_type_id = cm.media_type_id
          WHERE c.worldcup_id = ?
          ;`,
        [worldcupId]
      );
    console.log(result);

    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function getCandidateStatisticsByCandidateId(candidateId: string) {
  try {
    const [result, meta]: [CandidateWithStatistics[], FieldPacket[]] =
      await pool.query(
        `SELECT DATE(created_at) AS date,
        SUM(CASE WHEN mr.winner_candidate_id = ? THEN 1 ELSE 0 END) AS numberOfWins,
        SUM(CASE WHEN mr.loser_candidate_id = ? THEN 1 ELSE 0 END) AS numberOfLosses,
        SUM(CASE WHEN mr.winner_candidate_id = ? AND mr.is_final_match IS TRUE THEN 1 ELSE 0 END) AS numberOfTrophies
        FROM match_result mr
        WHERE mr.winner_candidate_id = ? OR mr.loser_candidate_id = ?
        GROUP BY date;`,
        [candidateId, candidateId, candidateId, candidateId, candidateId]
      );
    console.log(result);

    return result;
  } catch (err) {
    console.log(err);
  }
}
