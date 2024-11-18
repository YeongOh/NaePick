'use server';

import { redirect } from 'next/navigation';

import { deleteSession } from '@/app/lib/session';

export async function signout() {
  await deleteSession();

  redirect('/');
}
