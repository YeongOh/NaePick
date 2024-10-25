'use server';

import { pool } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';
import { validateWorldcupOwnership } from '../auth/worldcup-ownership';
import { getSession } from '../session';

export async function createCandidate(
  worldcupId: string,
  candidateId: string,
  candidateName: string,
  candidateUrl: string
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      throw new Error('로그인을 해주세요.');
    }
    await validateWorldcupOwnership(worldcupId, session.userId);
    const [result, fields] = await pool.query(
      `
        INSERT INTO candidate
        (candidate_id, worldcup_id, name, url)
        VALUES
        (?, ?, ?, ?)
        `,
      [candidateId, worldcupId, candidateName, candidateUrl]
    );
  } catch (error) {
    console.log(error);
  }
  revalidatePath(`/worldcups/${worldcupId}/update-candidates`);
}
