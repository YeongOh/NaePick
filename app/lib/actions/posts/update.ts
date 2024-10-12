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
import { Candidate } from '../../definitions';

const UpdatePostFormSchema = z.object({
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

export type UpdatePostFormState = {
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

export async function updatePost(
  prevState: UpdatePostFormState,
  formData: FormData
) {
  const validatedFields = UpdatePostFormSchema.safeParse({
    id: formData.get('id'),
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
    id: postId,
    title,
    description,
    publicity,
    categoryId,
    numberOfCandidates,
    thumbnails,
  } = validatedFields.data;
  console.log(title, description);
  console.log('%%%%%%%%%%');
  console.log(postId);

  // 후보 이름 중복 확인
  const oldCandidates = JSON.parse(formData.get('oldCandidates') as string);
  console.log(oldCandidates);
  const candidatesNameSet = new Set<string>();
  for (const { name } of oldCandidates) {
    candidatesNameSet.add(name);
  }
  const newCandidateNames = [];
  for (let i = 0; i < numberOfCandidates - oldCandidates.length; i++) {
    const candidateName = formData.get(`candidateNames[${i}]`) as string;
    newCandidateNames.push(candidateName);
    candidatesNameSet.add(candidateName);
  }
  console.log(candidatesNameSet, numberOfCandidates);
  if (numberOfCandidates !== candidatesNameSet.size) {
    console.log('1');
    return {
      message: '후보 이름에 중복이 있습니다.',
    };
  }

  // 이미지 파일 중복 확인
  const files = [];
  for (let i = 0; i < numberOfCandidates - oldCandidates.length; i++) {
    const file = formData.get(`imageFiles[${i}]`) as File;
    files.push(file);
  }

  if (new Set(files).size != files.length) {
    return {
      message: '이미지 파일에 중복이 있습니다.',
    };
  }

  const connection = await getConnection();
  try {
    let leftCandidateId;
    let rightCandidateId;

    const session = await getSession();
    const userId = session.id;

    // 트랜잭션 시작
    await connection.beginTransaction();

    await connection.execute(
      `Update Posts 
        SET title = ?, description = ?, publicity = ?, categoryId = ?, numberOfCandidates = ?
        WHERE id = ? AND userID = ?`,
      [
        title,
        description,
        publicity,
        categoryId,
        numberOfCandidates,
        postId,
        userId,
      ]
    );

    for (const { id, name } of oldCandidates) {
      await connection.execute(
        `Update Candidates 
          SET name = ?
          WHERE id = ?`,
        [name, id]
      );
      const thumbnailIndex = thumbnails.findIndex(
        (thumbnailId) => thumbnailId === id
      );
      if (thumbnailIndex === 0) leftCandidateId = id;
      else if (thumbnailIndex === 1) rightCandidateId = id;
    }

    for (let i = 0; i < newCandidateNames.length; i++) {
      const file = files[i];
      const candidateName = newCandidateNames[i];

      const ext = path.extname(file.name);

      const candidateId = uuidv4();
      const url = `/${candidateId}${ext}`;

      const thumbnailIndex = thumbnails.findIndex(
        (name) => name === candidateName
      );
      if (thumbnailIndex === 0) leftCandidateId = candidateId;
      else if (thumbnailIndex === 1) rightCandidateId = candidateId;

      await connection.execute(
        `INSERT INTO Candidates (id, postId, name, url)
          VALUES (?, ?, ?, ?)`,
        [candidateId, postId, candidateName, url]
      );

      const promises: Promise<void>[] = [];
      promises.push(uploadImage(file, url));

      const result = await Promise.all(promises);
    }
    console.log('undefined?');
    console.log(leftCandidateId, rightCandidateId, postId);

    await connection.execute(
      `Update Thumbnails
        SET leftCandidateId = ?, rightCandidateId = ?
        WHERE postId = ?`,
      [leftCandidateId, rightCandidateId, postId]
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
