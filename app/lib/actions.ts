'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import mysql from 'mysql2/promise';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const FormSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  publicity: z.enum(['public', 'unlisted', 'private']),
  categoryId: z.coerce.number(),
  numberOfCandidates: z.coerce.number(),
  thumbnails: z.array(z.string()),
});

export type State = {
  errors?: {
    title?: string[];
    description?: string[];
    publicity?: string[];
  };
  message?: string | null;
};

const CreateInvoice = FormSchema.omit({ id: true });

export async function createPost(prevState: State, formData: FormData) {
  console.log(formData.get('imageFiles[0]'));

  const validatedFields = CreateInvoice.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    publicity: formData.get('publicity'),
    categoryId: formData.get('categoryId'),
    numberOfCandidates: formData.get('numberOfCandidates'),
    thumbnails: JSON.parse(formData.get('thumbnails') as string),
  });
  console.log(formData);
  console.log(validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed.',
    };
  }

  // check filename duplicates

  // check candidate name duplicates

  const {
    title,
    description,
    publicity,
    categoryId,
    numberOfCandidates,
    thumbnails,
  } = validatedFields.data;

  console.log(thumbnails);

  const candidateNames = [];
  for (let i = 0; i < numberOfCandidates; i++) {
    const candidateName = formData.get(`candidateNames[${i}]`);
    candidateNames.push(candidateName);
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: 3306,
    });
    // await connection.beginTransaction();

    // 첫 번째 테이블에 데이터 삽입

    const postId = uuidv4();
    const promises = [];
    let leftCandidateId;
    let rightCandidateId;

    promises.push(
      await connection.execute(
        `INSERT INTO Posts (id, title, description, publicity, userId, categoryId, numberOfCandidates) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          postId,
          title,
          description,
          publicity,
          723,
          categoryId,
          numberOfCandidates,
        ]
      )
    );

    for (let i = 0; i < numberOfCandidates; i++) {
      const file = formData.get(`imageFiles[${i}]`) as File;
      const ext = path.extname(file.name);

      const candidateId = uuidv4();
      const url = `/${candidateId}${ext}`;

      promises.push(
        await connection.execute(
          `INSERT INTO Candidates (id, postId, name, url) 
        VALUES (?, ?, ?, ?)`,
          [candidateId, postId, candidateNames[i], url]
        )
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

      promises.push(await uploadImageFile(file, url));
    }

    promises.push(
      await connection.execute(
        `INSERT INTO Thumbnails (postId, leftCandidateId, rightCandidateId) 
      VALUES (?, ?, ?)`,
        [postId, leftCandidateId, rightCandidateId]
      )
    );

    const result = await Promise.all(promises);
    console.log('promise result');
    console.log(result);
  } catch (error) {
    console.log(error);
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  revalidatePath('/posts');
  redirect('/posts');
}

async function uploadImageFile(file: File, filename: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(process.cwd(), 'public/' + filename), buffer);
}
