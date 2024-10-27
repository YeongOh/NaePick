'use server';

import { FieldPacket } from 'mysql2';
import { pool } from '../db';
import { Candidate, CandidateWithStatistics } from '../definitions';

export async function getRandomCandidatesByWorldcupId(
  worldcupId: string,
  round: number | string
) {
  try {
    const roundForSQL = round === typeof 'string' ? Number(round) : round;

    console.log(worldcupId, round);
    // rand() 이용한 정렬은 인덱스를 이용하지 않기에 데이터가 많을 경우 성능 저하
    const [result, meta]: [Candidate[], FieldPacket[]] = await pool.query(
      `SELECT c.candidate_id AS candidateId,
              c.created_at AS createdAt,
              c.name AS name,
              cm.pathname AS pathname,
              cm.thumbnail_url AS thumbnailURL,
              t.type As mediaType
        FROM candidate c
        JOIN candidate_media cm ON c.candidate_id = cm.candidate_id
        JOIN media_type t ON t.media_type_id = cm.media_type_id
        WHERE c.worldcup_id = ?
        ORDER BY RAND()
        LIMIT ?;`,
      [worldcupId, roundForSQL === 0 ? 32 : roundForSQL]
    );
    console.log(result);

    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function getCandidatesToUpdateByWorldcupId(worldcupId: string) {
  try {
    const [result, meta]: [Candidate[], FieldPacket[]] = await pool.query(
      `SELECT c.candidate_id AS candidateId,
              c.created_at AS createdAt,
              c.name AS name,
              cm.pathname AS pathname,
              cm.thumbnail_url AS thumbnailURL,
              t.type As mediaType
        FROM candidate c
        JOIN candidate_media cm ON c.candidate_id = cm.candidate_id
        JOIN media_type t ON t.media_type_id = cm.media_type_id
        WHERE c.worldcup_id = ?;`,
      [worldcupId]
    );
    console.log(result);

    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function getCandidatesStatisticsByWorldcupId(worldcupId: string) {
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
