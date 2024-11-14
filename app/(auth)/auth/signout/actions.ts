'use server';

import { deleteSessionAction } from '@/app/lib/session';
import { redirect } from 'next/navigation';

export async function signout() {
  await deleteSessionAction();

  redirect('/');
}
