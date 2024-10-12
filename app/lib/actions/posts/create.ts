'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  POST_DESCRIPTION_MAX_LENGTH,
  POST_TITLE_MAX_LENGTH,
  POST_TITLE_MIN_LENGTH,
} from '../../../constants';
import getConnection from '../../db';
import { getSession } from '../session';
import { uploadImage } from '../../images';

const CreatePostFormSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(POST_TITLE_MIN_LENGTH, {
      message: `제목은 ${POST_TITLE_MIN_LENGTH}자 이상이어야 합니다.`,
    })
    .max(POST_TITLE_MAX_LENGTH, {
      message: `제목은 ${POST_TITLE_MAX_LENGTH}자 이하여야 합니다.`,
    }),
  description: z
    .string()
    .max(POST_DESCRIPTION_MAX_LENGTH, {
      message: `설명은 ${POST_DESCRIPTION_MAX_LENGTH}자 이하여야 합니다.`,
    })
    .optional(),
  publicity: z.enum(['public', 'unlisted', 'private']),
  categoryId: z.coerce
    .number()
    .positive({ message: '카테고리를 선택해주세요.' }),
  numberOfCandidates: z.coerce
    .number()
    .gte(2, { message: '후보는 2명 이상이어야 합니다.' }),
  thumbnails: z.array(z.string()).length(2, {
    message: '후보 이미지를 클릭하여 썸네일을 2개 선택해주세요.',
  }),
});

export type CreatePostFormState = {
  errors?: {
    title?: string[];
    description?: string[];
    publicity?: string[];
    categoryId?: string[];
    numberOfCandidates?: string[];
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
    numberOfCandidates: formData.get('numberOfCandidates'),
    thumbnails: JSON.parse(formData.get('thumbnails') as string),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '누락된 항목이 있습니다.',
    };
  }

  const {
    title,
    description,
    publicity,
    categoryId,
    numberOfCandidates,
    thumbnails,
  } = validatedFields.data;

  const candidateNames = [];
  const files = [];
  for (let i = 0; i < numberOfCandidates; i++) {
    const candidateName = formData.get(`candidateNames[${i}]`);
    candidateNames.push(candidateName);
    const file = formData.get(`imageFiles[${i}]`) as File;
    files.push(file);
  }

  if (new Set(files).size != files.length) {
    return {
      message: '이미지 파일에 중복이 있습니다.',
    };
  }
  if (new Set(candidateNames).size != candidateNames.length) {
    return {
      message: '후보 이름에 중복이 있습니다.',
    };
  }

  const connection = await getConnection();
  try {
    const postId = uuidv4();
    let leftCandidateId;
    let rightCandidateId;

    const session = await getSession();
    const userId = session.id;

    // 트랜잭션 시작
    await connection.beginTransaction();

    await connection.execute(
      `INSERT INTO Posts (id, title, description, publicity, userId, categoryId, numberOfCandidates) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        postId,
        title,
        description,
        publicity,
        userId,
        categoryId,
        numberOfCandidates,
      ]
    );

    for (let i = 0; i < numberOfCandidates; i++) {
      const file = files[i];
      const candidateName = candidateNames[i];

      const ext = path.extname(file.name);

      const candidateId = uuidv4();
      const url = `/${candidateId}${ext}`;

      await connection.execute(
        `INSERT INTO Candidates (id, postId, name, url) 
        VALUES (?, ?, ?, ?)`,
        [candidateId, postId, candidateName, url]
      );
      // check filename with thumbnail filenames

      const thumbnailIndex = thumbnails.findIndex(
        (filename) => filename === file.name
      );
      if (thumbnailIndex == 0) {
        leftCandidateId = candidateId;
      } else if (thumbnailIndex == 1) {
        rightCandidateId = candidateId;
      }

      const promises: Promise<void>[] = [];
      promises.push(uploadImage(file, url));

      const result = await Promise.all(promises);
    }

    const thumbnailId = uuidv4();

    await connection.execute(
      `INSERT INTO Thumbnails (id, postId, leftCandidateId, rightCandidateId) 
      VALUES (?, ?, ?, ?)`,
      [thumbnailId, postId, leftCandidateId, rightCandidateId]
    );

    const postStatsId = uuidv4();

    await connection.execute(
      `INSERT INTO PostStats (id, postId) 
      VALUES (?, ?)`,
      [postStatsId, postId]
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
