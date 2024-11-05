'use server';

import { FieldPacket } from 'mysql2';
import { CandidateWithStatistics } from '../definitions';
import { pool } from '../db';

export async function getCandidateStatisticsByWorldcupIdAndPageNumber(
  worldcupId: string,
  pageNumber: number
) {
  try {
    const [result, meta]: [CandidateWithStatistics[], FieldPacket[]] =
      await pool.query(
        `WITH candidate_statistic AS (
      SELECT c.candidate_id AS candidateId, 
             c.name AS name,
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
  )
  SELECT candidateId,
         name,
         pathname,
         thumbnailURL,
         mediaType,
         numberOfWins,
         numberOfLosses,
         numberOfTrophies,
         CASE 
             WHEN numberOfWins + numberOfLosses = 0 THEN 0
             ELSE CAST(numberOfWins AS FLOAT) / (numberOfWins + numberOfLosses)
         END AS winRate
  FROM candidate_statistic
  ORDER BY winrate DESC
  LIMIT 10 OFFSET ?;`,
        [worldcupId, (pageNumber - 1) * 10]
      );

    return result;
  } catch (err) {
    console.log(err);
  }
}
