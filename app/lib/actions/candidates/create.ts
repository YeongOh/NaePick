'use server';

import { pool } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';
import { validateWorldcupOwnership } from '../auth/worldcup-ownership';
import { getSession } from '../session';
import { nanoid } from 'nanoid';
import {
  CANDIDATE_ID_LENGTH,
  CANDIDATE_NAME_MAX_LENGTH,
} from '@/app/constants';
import { MediaType } from '../../definitions';

interface CandidateParameters {
  worldcupId: string;
  candidateName: string;
  candidatePathname: string;
  mediaType: MediaType;
  thumbnailURL?: string;
}

export async function createCandidate({
  worldcupId,
  candidateName,
  candidatePathname,
  mediaType,
  thumbnailURL,
}: CandidateParameters) {
  try {
    console.log('-1');
    const session = await getSession();
    console.log('0');
    if (!session?.userId) {
      throw new Error('로그인을 해주세요.');
    }

    await validateWorldcupOwnership(worldcupId, session.userId);

    if (candidateName.length > CANDIDATE_NAME_MAX_LENGTH) {
      throw new Error('후보 이름이 글자 수 제한을 초과했습니다.');
    }

    const candidateId = nanoid(CANDIDATE_ID_LENGTH);

    console.log('1');
    await pool.query('START TRANSACTION');
    const [result1, fields1] = await pool.query(
      `
        INSERT INTO candidate
        (candidate_id, worldcup_id, name)
        VALUES
        (?, ?, ?)
        `,
      [candidateId, worldcupId, candidateName]
    );
    console.log(result1);
    const [result, fields] = await pool.query(
      `
        INSERT INTO candidate_media
        (candidate_id, pathname, media_type_id, thumbnail_url)
        VALUES
        (?, ?, (SELECT media_type_id FROM media_type WHERE type = ?), ?)
        `,
      [candidateId, candidatePathname, mediaType, thumbnailURL ?? null]
    );
    await pool.query('COMMIT');
    console.log(result);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.log(error);
  }
  revalidatePath(`/worldcups/${worldcupId}/update-candidates`);
}
