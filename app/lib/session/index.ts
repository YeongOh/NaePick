import 'server-only';

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { nanoid } from 'nanoid';
import { SessionInsert, sessions, users } from '../database/schema';
import { db } from '../database';
import { eq } from 'drizzle-orm';
import dayjs from '@/app/utils/dayjs';
import { cache } from 'react';
import { SessionCookie, sessionCookieOptions, sessionDuration } from './cookies';

export const getSession = cache(async () => {
  const sessionCookie = await getIronSession<SessionCookie>(cookies(), sessionCookieOptions);
  if (!sessionCookie.userId) {
    return null;
  }

  const isVerified = await validateSessionId(sessionCookie.sessionId);
  if (isVerified) {
    return sessionCookie;
  }

  return null;
});

export async function createSession({
  userId,
  nickname,
  profilePath,
  email,
}: Omit<SessionCookie, 'sessionId'>) {
  const sessionCookie = await getIronSession<SessionCookie>(cookies(), sessionCookieOptions);
  const sessionId = nanoid();
  const session: SessionInsert = {
    id: sessionId,
    userId,
    expiresAt: dayjs(new Date(Date.now() + 1000 * sessionDuration)).format('YYYY/MM/DD HH/mm/ss'),
  };
  await db.insert(sessions).values(session);
  const newSessionCookie = { sessionId, userId, nickname, profilePath, email };
  Object.assign(sessionCookie, newSessionCookie);
  await sessionCookie.save();
}

const validateSessionId = async (sessionId: string): Promise<boolean> => {
  const result = await db
    .select({ expiresAt: sessions.expiresAt })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId));
  if (result.length < 1) return false;

  const { expiresAt } = result[0];
  if (dayjs(Date.now()).isAfter(dayjs(expiresAt))) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return false;
  }

  return true;
};

export async function deleteSession() {
  const sessionCookie = await getIronSession<SessionCookie>(cookies(), sessionCookieOptions);
  const sessionId = sessionCookie.sessionId;
  sessionCookie.destroy();
  if (!sessionId) {
    return;
  }
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}
