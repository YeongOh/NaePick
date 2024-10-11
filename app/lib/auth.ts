import { SessionOptions } from 'iron-session';

// ex : https://supabase.com/docs/guides/auth/users

export type SignupState = {
  errors?: SignupError;
  message?: string | null;
};

export type SignupError = {
  username?: string[];
  email?: string[];
  nickname?: string[];
  password?: string[];
  confirmPassword?: string[];
};

export type SigninState = {
  errors?: {
    username?: string[];
    password?: string[];
  };
  message?: string | null;
};

export const sessionOptions: SessionOptions = {
  password: 'complex-password-for-cookiecomplex-password-for-cookie',
  cookieName: 'test-example',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export interface SessionData {
  id: string;
  username: string;
  nickname: string;
}
