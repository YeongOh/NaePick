'use server';

import { pool } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';
import { validateWorldcupOwnership } from '../auth/worldcup-ownership';
import { getSession } from '../session';
import { nanoid } from 'nanoid';
import { CANDIDATE_ID_LENGTH } from '@/app/constants';
import { MediaType } from '../../definitions';

export async function createCandidate(
  worldcupId: string,
  candidateName: string,
  candidateUrl: string,
  mediaType: MediaType
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      throw new Error('로그인을 해주세요.');
    }
    await validateWorldcupOwnership(worldcupId, session.userId);

    const candidateId = nanoid(CANDIDATE_ID_LENGTH);
    const [result, fields] = await pool.query(
      `
        INSERT INTO candidate
        (candidate_id, worldcup_id, name)
        VALUES
        (?, ?, ?)
        `,
      [candidateId, worldcupId, candidateName]
    );

    await pool.query(
      `
        INSERT INTO candidate_media
        (candidate_id, url, media_type_id)
        VALUES
        (?, ?, (SELECT media_type_id FROM media_type WHERE type = ?))
        `,
      [candidateId, candidateUrl, mediaType]
    );

    return candidateId;
  } catch (error) {
    console.log(error);
  }
  revalidatePath(`/worldcups/${worldcupId}/update-candidates`);
}
