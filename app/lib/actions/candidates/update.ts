'use server';

import { pool } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '../session';
import { validateWorldcupOwnership } from '../auth/worldcup-ownership';

export async function updateCandidateNames(
  worldcupId: string,
  candidateObjects: {
    [k: string]: FormDataEntryValue;
  }
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      throw new Error('로그인을 해주세요.');
    }

    await validateWorldcupOwnership(worldcupId, session.userId);

    for (const [candidateId, candidateName] of Object.entries(
      candidateObjects
    )) {
      const [result, fields] = await pool.query(
        `
        UPDATE candidate
        SET name = ?
        WHERE candidate_id = ?
        `,
        [candidateName, candidateId]
      );
      console.log(result);
    }
  } catch (error) {
    console.log(error);
  }
  revalidatePath(`/worldcups/${worldcupId}/update-candidates`);
}

export async function updateCandidateImageURL(
  worldcupId: string,
  candidateId: string,
  candidateURL: string
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      throw new Error('로그인을 해주세요.');
    }

    await validateWorldcupOwnership(worldcupId, session.userId);

    const [result, fields] = await pool.query(
      `
            UPDATE candidate
            SET url = ?
            WHERE candidate_id = ?
            `,
      [candidateURL, candidateId]
    );
  } catch (error) {
    console.log(error);
  }
  revalidatePath(`/worldcups/${worldcupId}/update-candidates`);
}
