import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { SessionCookie, sessionCookieOptions } from './cookies';

export const getOptimisticSession = async () => {
  const sessionCookie = await getIronSession<SessionCookie>(cookies(), sessionCookieOptions);
  return sessionCookie;
};
