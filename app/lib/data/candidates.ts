import { FieldPacket } from 'mysql2';
import { pool } from '../db';
import { Candidate } from '../definitions';

export async function fetchRandomCandidatesByWorldcupId(
  worldcupId: string,
  round: number | string
) {
  try {
    const roundForSQL = round === typeof 'string' ? Number(round) : round;

    console.log(worldcupId, round);
    // rand() 이용한 정렬은 인덱스를 이용하지 않기에 데이터가 많을 경우 성능 저하
    const [result, meta]: [Candidate[], FieldPacket[]] = await pool.query(
      `SELECT candidate_id AS candidateId,
                created_at AS createdAt,
                name, url
          FROM candidate 
          WHERE worldcup_id = ? 
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
