'use server';

import { pool } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteCandidate(worldcupId: string, candidateId: string) {
  try {
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
  }
  revalidatePath(`/worldcups/${worldcupId}/update-candidates`);
}
