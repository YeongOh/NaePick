'use server';

import { pool } from '@/app/lib/database';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';
import {
  CANDIDATE_ID_LENGTH,
  CANDIDATE_NAME_MAX_LENGTH,
} from '@/app/constants';
import { getSession } from '@/app/lib/session';
import { MediaType } from '@/app/lib/types';
import { validateWorldcupOwnership } from '@/app/lib/worldcups/auth';

interface CandidateParameters {
  worldcupId: string;
  candidateName: string;
  candidatePathname: string;
  mediaType: MediaType;
  thumbnailURL?: string;
}

export async function createCandidate({
  worldcupId,
  candidateName,
  candidatePathname,
  mediaType,
  thumbnailURL,
}: CandidateParameters) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      throw new Error('로그인을 해주세요.');
    }

    await validateWorldcupOwnership(worldcupId, session.userId);

    if (candidateName.length > CANDIDATE_NAME_MAX_LENGTH) {
      throw new Error('후보 이름이 글자 수 제한을 초과했습니다.');
    }

    const candidateId = nanoid(CANDIDATE_ID_LENGTH);

    await pool.query('START TRANSACTION');
    const [result1, fields1] = await pool.query(
      `
        INSERT INTO candidate
        (candidate_id, worldcup_id, name)
        VALUES
        (?, ?, ?)
        `,
      [candidateId, worldcupId, candidateName]
    );
    const [result, fields] = await pool.query(
      `
        INSERT INTO candidate_media
        (candidate_id, pathname, media_type_id, thumbnail_url)
        VALUES
        (?, ?, (SELECT media_type_id FROM media_type WHERE type = ?), ?)
        `,
      [candidateId, candidatePathname, mediaType, thumbnailURL ?? null]
    );
    await pool.query('COMMIT');
  } catch (error) {
    await pool.query('ROLLBACK');
    console.log(error);
  }
  revalidatePath(`/wc/edit-candidates/${worldcupId}`);
}

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
  revalidatePath(`/wc/edit-candidates/${worldcupId}`);
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
  revalidatePath(`/wc/edit-candidates/${worldcupId}`);
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
  revalidatePath(`/wc/edit-candidates/${worldcupId}`);
}

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
  } catch (error) {
    console.log(error);
    throw new Error('후보 삭제 실패...');
  }
  revalidatePath(`/wc/edit-candidates/${worldcupId}`);
}
