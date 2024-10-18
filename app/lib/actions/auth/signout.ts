'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { deleteSession } from '../session';

export async function signout() {
  await deleteSession();

  // TODO: 로그아웃 토스트
  revalidatePath('/');
  redirect('/');
}
