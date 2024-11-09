'use server';

import { getSession } from '@/app/lib/session';
import { deleteImage, deleteVideo, listImageFiles, listVideoFiles } from '@/app/lib/storage';
import { verifyWorldcupOwner } from '@/app/lib/worldcup/auth';
import { deleteWorldcup } from '@/app/lib/worldcup/service';
import { revalidatePath } from 'next/cache';

export async function deleteWorldcupAction(worldcupId: string) {
  const session = await getSession();
  if (!session?.userId) throw new Error('로그인 세션이 만료되었습니다.');

  const userId = session.userId;
  const isVerified = verifyWorldcupOwner(worldcupId, userId);
  if (!isVerified) throw new Error('월드컵을 삭제할 수 없습니다.');

  try {
    const worldcupKey = `worldcups/${worldcupId}`;
    const imgObjects = await listImageFiles(worldcupKey);
    const deleteObjectPromises: Promise<void>[] = [];
    if (imgObjects && imgObjects.length)
      imgObjects.forEach(({ Key }) => deleteObjectPromises.push(deleteImage(Key as string)));

    const videoObjects = await listVideoFiles(worldcupKey);
    if (videoObjects && videoObjects.length)
      videoObjects.forEach(({ Key }) => deleteObjectPromises.push(deleteVideo(Key as string)));

    await Promise.all(deleteObjectPromises);
    await deleteWorldcup(worldcupId);
  } catch (err) {
    console.log(err);
  }
  revalidatePath(`/wc/users/${session.userId}`);
}
