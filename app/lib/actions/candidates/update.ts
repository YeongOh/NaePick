'use server';

import { pool } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateCandidateNames(
  worldcupId: string,
  candidateObjects: {
    [k: string]: FormDataEntryValue;
  }
) {
  try {
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
