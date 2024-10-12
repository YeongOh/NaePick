import 'server-only';

import { getIronSession } from 'iron-session';
import { SessionData, sessionOptions } from '../auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
}

export async function createSession(data: SessionData, persistLogin = false) {
  const session = await getSession();

  session.id = data.id;
  session.username = data.username;
  session.nickname = data.nickname;
  await session.save();
}

export async function deleteSession() {
  const session = await getSession();
  session.destroy();
}
