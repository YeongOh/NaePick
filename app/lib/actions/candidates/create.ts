'use server';

import { pool } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';

export async function createCandidate(
  worldcupId: string,
  candidateId: string,
  candidateName: string,
  candidateUrl: string
) {
  try {
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
