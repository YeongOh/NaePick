'use server';

import { FieldPacket } from 'mysql2';
import { db } from '../database';
import { Candidate } from '../types';

export async function getRandomCandidatesByWorldcupId(
  worldcupId: string,
  round: number | string
) {
  try {
    const roundForSQL = round === typeof 'string' ? Number(round) : round;

    // rand() 이용한 정렬은 인덱스를 이용하지 않기에 데이터가 많을 경우 성능 저하
    const [result, meta]: [Candidate[], FieldPacket[]] = await db.query(
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
      [worldcupId, roundForSQL]
    );

    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function getCandidatesToUpdateByWorldcupId(
  worldcupId: string,
  pageNumber = 1
) {
  try {
    const [result, meta]: [Candidate[], FieldPacket[]] = await db.query(
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
        ORDER BY c.created_at DESC
        LIMIT 10 OFFSET ?;`,
      [worldcupId, (pageNumber - 1) * 10]
    );

    return result;
  } catch (err) {
    console.log(err);
  }
}
