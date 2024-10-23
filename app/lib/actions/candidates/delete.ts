'use server';

import { pool } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '../session';
import { validateWorldcupOwnership } from '../auth/worldcup-ownership';

export async function deleteCandidate(candidateId: string, worldcupId: string) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      throw new Error('로그인을 해주세요.');
    }

    await validateWorldcupOwnership(worldcupId, session.userId);

    const [result, fields] = await pool.query(
      `
        DELETE FROM candidate
        WHERE candidate_id = ?
        `,
      [candidateId]
    );
    console.log(result);
  } catch (error) {
    console.log(error);
    throw new Error('후보 삭제 실패...');
  }
  revalidatePath(`/worldcups/${worldcupId}/update-candidates`);
}
