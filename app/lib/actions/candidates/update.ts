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
    }
  } catch (error) {
    console.log(error);
  }
  revalidatePath(`/worldcups/${worldcupId}/update-candidates`);
}

export async function updateCandidateImageURL(
  worldcupId: string,
  candidateId: string,
  candidatePathname: string
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      throw new Error('로그인을 해주세요.');
    }

    await validateWorldcupOwnership(worldcupId, session.userId);

    const [result, fields] = await pool.query(
      `
            UPDATE candidate_media
            SET pathname = ?,
                media_type_id =   
                (SELECT media_type_id
                FROM media_type
                WHERE type = ?),
                thumbnail_url = ?
            WHERE candidate_id = ?
            `,
      [candidatePathname, 'cdn_img', null, candidateId]
    );
  } catch (error) {
    console.log(error);
  }
  revalidatePath(`/worldcups/${worldcupId}/update-candidates`);
}

export async function updateCandidateVideoURL({
  worldcupId,
  candidateId,
  candidatePathname,
  mediaType,
  thumbnailURL = null,
}: {
  worldcupId: string;
  candidateId: string;
  candidatePathname: string;
  mediaType: string;
  thumbnailURL?: string | null;
}) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      throw new Error('로그인을 해주세요.');
    }

    await validateWorldcupOwnership(worldcupId, session.userId);

    const [result, fields] = await pool.query(
      `
            UPDATE candidate_media
            SET pathname = ?,
                media_type_id =   
                (SELECT media_type_id
                FROM media_type
                WHERE type = ?),
                thumbnail_url = ?
            WHERE candidate_id = ?
            `,
      [candidatePathname, mediaType, thumbnailURL, candidateId]
    );
  } catch (error) {
    console.log(error);
  }
  revalidatePath(`/worldcups/${worldcupId}/update-candidates`);
}
