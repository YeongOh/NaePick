import 'server-only';

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SessionData, sessionOptions } from '../types';

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
}

export async function createSession(data: SessionData, persistLogin = false) {
  const session = await getSession();

  Object.assign(session, data);
  await session.save();
}

export async function deleteSession() {
  const session = await getSession();
  session.destroy();
}
