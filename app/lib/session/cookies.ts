import { SessionOptions } from 'iron-session';

// 7 days
export const sessionDuration = 60 * 60 * 24 * 7;

export const sessionCookieOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: 'session',
  ttl: sessionDuration,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: sessionDuration - 60,
  },
};

export interface SessionCookie {
  sessionId: string;
  userId: string;
  nickname: string;
  profilePath: string | null;
  email: string;
}
