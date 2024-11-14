'use server';

import { deleteSession } from '@/app/lib/session';
import { redirect } from 'next/navigation';

export async function signout() {
  await deleteSession();

  redirect('/');
}
