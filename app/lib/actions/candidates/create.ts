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
    // 월드컵 오너십 확인은 반복문 전에 이미 완료
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
