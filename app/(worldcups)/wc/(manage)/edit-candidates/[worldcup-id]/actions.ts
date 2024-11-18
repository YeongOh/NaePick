'use server';

import path from 'path';

import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';

import { OBJECT_ID_LENGTH } from '@/app/constants';
import {
  createCandidate,
  deleteCandidate,
  updateCandidate,
  updateCandidateNames,
} from '@/app/lib/candidate/service';
import { getSession } from '@/app/lib/session';
import { deleteImage, deleteVideo, getSignedUrlForImage } from '@/app/lib/storage';
import { verifyWorldcupOwner } from '@/app/lib/worldcup/auth';
import { mp4toJpg } from '@/app/utils';

export async function getSignedUrlForCandidateImage(worldcupId: string, fileType: string, filePath: string) {
  const session = await getSession();
  if (!session?.userId) throw new Error('로그인 세션이 만료되었습니다.');

  const isVerified = await verifyWorldcupOwner(worldcupId, session.userId);
  if (!isVerified) throw new Error('올바르지 않은 접근입니다.');

  const extname = path.extname(filePath);

  const objectId = nanoid(OBJECT_ID_LENGTH);
  const key = `worldcups/${worldcupId}/${objectId}${extname}`;

  const url = await getSignedUrlForImage(key, fileType);
  return { url, path: key };
}

export async function createCandidateAction({
  worldcupId,
  name,
  path,
  mediaType,
  thumbnailUrl,
}: {
  worldcupId: string;
  name: string;
  path: string;
  mediaType: string;
  thumbnailUrl?: string;
}) {
  const session = await getSession();
  if (!session?.userId) throw new Error('로그인을 해주세요.');

  const isVerified = await verifyWorldcupOwner(worldcupId, session.userId);
  if (!isVerified) throw new Error('잘못된 접근입니다.');

  await createCandidate({ worldcupId, name, path, mediaType, thumbnailUrl });
  revalidatePath(`/wc/edit-candidates/${worldcupId}`);
}

export async function updateCandidateNamesAction(worldcupId: string, formData: FormData) {
  const session = await getSession();
  if (!session?.userId) throw new Error('로그인을 해주세요.');

  const isVerified = await verifyWorldcupOwner(worldcupId, session.userId);
  if (!isVerified) throw new Error('잘못된 접근입니다.');

  const formEntires = Object.fromEntries(formData);
  const candidateNames = Object.entries(formEntires).map(([id, name]) => ({ id, name: String(name) }));
  await updateCandidateNames(candidateNames);
  revalidatePath(`/wc/edit-candidates/${worldcupId}`);
}

export async function deleteCandidateObject(
  path: string,
  worldcupId: string,
  mediaType: 'cdn_img' | 'cdn_video',
) {
  const session = await getSession();
  if (!session?.userId) throw new Error('로그인을 해주세요.');

  const isVerified = await verifyWorldcupOwner(worldcupId, session.userId);
  if (!isVerified) throw new Error('잘못된 접근입니다.');

  if (mediaType === 'cdn_img') {
    await deleteImage(path);
    return;
  }

  if (mediaType === 'cdn_video') {
    await deleteVideo(path);
    await deleteImage(mp4toJpg(path));
    return;
  }
}

export async function deleteCandidateAction(candidateId: string, worldcupId: string) {
  const session = await getSession();
  if (!session?.userId) throw new Error('로그인을 해주세요.');

  const isVerified = await verifyWorldcupOwner(worldcupId, session.userId);
  if (!isVerified) throw new Error('잘못된 접근입니다.');

  await deleteCandidate(candidateId);
  revalidatePath(`/wc/edit-candidates/${worldcupId}`);
}

export async function updateCandidateAction({
  worldcupId,
  candidateId,
  path,
  mediaType,
  thumbnailUrl,
}: {
  worldcupId: string;
  candidateId: string;
  path: string;
  mediaType: string;
  thumbnailUrl?: string;
}) {
  const session = await getSession();
  if (!session?.userId) throw new Error('로그인을 해주세요.');

  const isVerified = await verifyWorldcupOwner(worldcupId, session.userId);
  if (!isVerified) throw new Error('잘못된 접근입니다.');

  await updateCandidate({ candidateId, path, mediaType, thumbnailUrl });
  revalidatePath(`/wc/edit-candidates/${worldcupId}`);
}
