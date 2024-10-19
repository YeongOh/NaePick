'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  WORLDCUP_DESCRIPTION_MAX_LENGTH,
  WORLDCUP_TITLE_MAX_LENGTH,
  WORLDCUP_TITLE_MIN_LENGTH,
} from '../../../constants';
import { pool } from '../../db';
import { getSession } from '../session';
import { uploadFile } from '../../images';

const CreatePostFormSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(WORLDCUP_TITLE_MIN_LENGTH, {
      message: `제목은 ${WORLDCUP_TITLE_MIN_LENGTH}자 이상이어야 합니다.`,
    })
    .max(WORLDCUP_TITLE_MAX_LENGTH, {
      message: `제목은 ${WORLDCUP_TITLE_MAX_LENGTH}자 이하여야 합니다.`,
    }),
  description: z
    .string()
    .max(WORLDCUP_DESCRIPTION_MAX_LENGTH, {
      message: `설명은 ${WORLDCUP_DESCRIPTION_MAX_LENGTH}자 이하여야 합니다.`,
    })
    .optional(),
  publicity: z.enum(['public', 'unlisted', 'private']),
  categoryId: z.coerce
    .number()
    .positive({ message: '카테고리를 선택해주세요.' }),
  thumbnails: z.array(z.number()).length(2, {
    message: '후보 이미지를 클릭하여 썸네일을 2개 선택해주세요.',
  }),
});

export type CreatePostFormState = {
  errors?: {
    title?: string[];
    description?: string[];
    publicity?: string[];
    categoryId?: string[];
    thumbnails?: string[];
  };
  message?: string | null;
};

const CreateInvoice = CreatePostFormSchema.omit({ id: true });

export async function createPost(
  prevState: CreatePostFormState,
  formData: FormData
) {
  const validatedFields = CreateInvoice.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    publicity: formData.get('publicity'),
    categoryId: formData.get('categoryId'),
    thumbnails: JSON.parse(formData.get('thumbnails') as string),
  });
  console.log(formData.get('categoryId'));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '누락된 항목이 있습니다.',
    };
  }

  const { title, description, publicity, categoryId, thumbnails } =
    validatedFields.data;
  console.log(categoryId);

  const candidateNames = [];
  const files = [];

  let i = 0;
  while (true) {
    // TODO: 후보 이름 길이 확인
    const candidateName = formData.get(`candidateNames[${i}]`);
    if (!candidateName) {
      break;
    }
    candidateNames.push(candidateName);
    const file = formData.get(`imageFiles[${i}]`) as File;
    files.push(file);
    ++i;
  }

  if (new Set(candidateNames).size != candidateNames.length) {
    return {
      message: '후보 이름에 중복이 있습니다.',
    };
  }
  const connection = await pool.getConnection();
  try {
    const worldcupId = uuidv4();
    let leftCandidateId;
    let rightCandidateId;

    const session = await getSession();
    const userId = session.userId;

    // 트랜잭션 시작
    await connection.beginTransaction();
    console.log(worldcupId, title, description, publicity, userId, categoryId);

    await connection.query(
      `INSERT INTO worldcup (worldcup_id, title, description, publicity, user_id, category_id) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [worldcupId, title, description, publicity, userId, categoryId]
    );
    for (let j = 0; j < files.length; j++) {
      const file = files[j];
      const candidateName = candidateNames[j];
      const ext = path.extname(file.name);
      const candidateId = uuidv4();

      const url = `worldcups/${worldcupId}/${candidateId}${ext}`;

      await connection.query(
        `INSERT INTO candidate (candidate_id, worldcup_id, name, url) 
        VALUES (?, ?, ?, ?)`,
        [candidateId, worldcupId, candidateName, url]
      );

      // check filename with thumbnail filenames
      const thumbnailIndex = thumbnails.findIndex(
        (thumbI) => Number(thumbI) === j
      );
      if (thumbnailIndex == 0) {
        leftCandidateId = candidateId;
      } else if (thumbnailIndex == 1) {
        rightCandidateId = candidateId;
      }

      const promises: Promise<void>[] = [];
      promises.push(uploadFile(file, url));

      const result = await Promise.all(promises);
    }

    await connection.query(
      `INSERT INTO thumbnail (worldcup_id, left_candidate_id, right_candidate_id) 
      VALUES (?, ?, ?)`,
      [worldcupId, leftCandidateId, rightCandidateId]
    );

    await connection.commit();
  } catch (error) {
    console.log(error);
    await connection.rollback();
    return {
      message: '이상형 월드컵 생성에 실패했습니다.',
    };
  }

  revalidatePath('/');
  redirect('/');
}
