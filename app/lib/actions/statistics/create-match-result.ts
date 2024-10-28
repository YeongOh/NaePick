'use server';

import { pool } from '../../db';
import { MatchResult } from '../../definitions';

export async function submitMatchResult(
  matchResult: MatchResult[],
  worldcupId: string
) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const insertPromises = matchResult.map((match, i) => {
      if (i === matchResult.length - 1) {
        const query = `INSERT INTO match_result (winner_candidate_id, loser_candidate_id, worldcup_id, is_final_match)
      VALUES (?, ?, ?, ?)`;
        return connection.query(query, [
          match.winnerCandidateId,
          match.loserCandidateId,
          worldcupId,
          true,
        ]);
      }
      const query = `INSERT INTO match_result (winner_candidate_id, loser_candidate_id, worldcup_id)
      VALUES (?, ?, ?)`;
      return connection.query(query, [
        match.winnerCandidateId,
        match.loserCandidateId,
        worldcupId,
      ]);
    });

    const result = await Promise.all(insertPromises);
    console.log(result);
    await connection.commit();
  } catch (error) {
    console.log(error);
    await connection.rollback();
  }
}
