'use server';

import { FieldPacket, RowDataPacket } from 'mysql2';
import { pool } from '../../db';
import { MatchResult, Thumbnail } from '../../definitions';

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

interface Stat extends RowDataPacket {
  candidate_id: string;
  win_count: number;
}

export async function updateThumbnailsByMatchResult(worldcupId: string) {
  try {
    // select top two champions
    const [result, meta]: [Stat[], FieldPacket[]] = await pool.query(
      `SELECT candidate_id, COUNT(*) AS win_count
      FROM champion
      WHERE worldcup_id = ?
      GROUP BY candidate_id
      ORDER BY win_count DESC
      LIMIT 2;`,
      [worldcupId]
    );
    const [thumbnail, thumbnailMeta]: [Thumbnail[], FieldPacket[]] =
      await pool.query(
        `SELECT left_candidate_id, right_candidate_id
      FROM thumbnail
      WHERE worldcup_id = ?;`,
        [worldcupId]
      );

    // 챔피언이 1명일 경우
    if (thumbnail[0] && result.length == 1) {
      const theOnlyChampionId = result[0].candidate_id;
      // 이미 썸네일에 포함되어 있을 경우 업데이트하지않고 종료
      if (
        thumbnail[0].leftCandidateId === theOnlyChampionId ||
        thumbnail[0].rightCandidateId === theOnlyChampionId
      ) {
        return;
      }
      // 아닐 경우 왼쪽 썸네일에 배치
      await pool.query(
        `UPDATE thumbnail 
        SET left_candidate_id = ?
        WHERE worldcup_id = ?;`,
        [theOnlyChampionId, worldcupId]
      );
      // 2명일 경우
    } else if (result.length == 2) {
      const topChampion = result[0].candidate_id;
      const secondChampion = result[1].candidate_id;
      // 바꿀 필요 없는 경우
      if (
        thumbnail[0].leftCandidateId === topChampion &&
        thumbnail[0].rightCandidateId === secondChampion
      ) {
        return;
      }
      // 업데이트
      await pool.query(
        `UPDATE thumbnail 
        SET left_candidate_id = ?,
        right_candidate_id = ?
        WHERE worldcup_id = ?;`,
        [topChampion, secondChampion, worldcupId]
      );
    }
  } catch (error) {
    console.log(error);
  }
}
