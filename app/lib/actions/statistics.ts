'use server';

import { pool } from '../db';
import { MatchResult } from '../definitions';

export async function submitMatchResult(
  matchResult: MatchResult[],
  worldcupId: string
) {
  const championCandidateId = matchResult.at(-1)?.winnerCandidateId;
  const query = matchResult.map((result) => {
    // [..., [winnerCandidateId, loserCandidateId, worldcupId]]
    const statement = Object.values(result);
    statement.push(worldcupId);
    return statement;
  });

  const sql = `INSERT INTO match_result (winner_candidate_id, loser_candidate_id, worldcup_id)
     VALUES ?`;

  try {
    await pool.query(sql, [query]);
    await pool.query(
      `INSERT INTO champion (candidate_id, worldcup_id) VALUES (?, ?)`,
      [championCandidateId, worldcupId]
    );
  } catch (error) {
    console.log(error);
  }
}
