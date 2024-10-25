'use server';

import { revalidatePath } from 'next/cache';
import { pool } from '../../db';
import { validateWorldcupOwnership } from '../auth/worldcup-ownership';
import { getSession } from '../session';

export async function updateThumbnail(
  worldcupId: string,
  position: 'left' | 'right',
  candidateId: string
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      throw new Error('로그인 세션이 만료되었습니다.');
    }

    await validateWorldcupOwnership(worldcupId, session.userId);

    if (position === 'left') {
      const [result, meta] = await pool.query(
        `UPDATE thumbnail 
            SET left_candidate_id = ?
            WHERE worldcup_id = ?`,
        [candidateId, worldcupId]
      );
      console.log(result);
    } else {
      await pool.query(
        `UPDATE thumbnail 
            SET right_candidate_id = ?
            WHERE worldcup_id = ?`,
        [candidateId, worldcupId]
      );
    }
  } catch (error) {
    console.log(error);
  }
  revalidatePath(`/worldcups/${worldcupId}/update-candidates`);
}
