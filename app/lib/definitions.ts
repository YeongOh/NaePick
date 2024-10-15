import { RowDataPacket } from 'mysql2';
import { SessionOptions } from 'iron-session';

export interface User extends RowDataPacket {
  id: string;
  username: string;
  nickname: string;
  role: 'user' | 'admin';
  email: string;
  emailConfirmedAt: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post extends RowDataPacket {
  id: string;
  title: string;
  description: string;
  publicity: 'public' | 'unlisted' | 'private';
  userId: string;
  categoryId: number;
  numberOfCandidates: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostCard extends Post {
  username: string;
  nickname: string;
  categoryName: string;
  leftCandidateName: string;
  rightCandidateName: string;
}

export interface PostInfo extends Post {
  username: string;
  nickname: string;
  categoryName: string;
}

export interface PostStat extends PostInfo {
  numberOfMatches: number;
  numberOfGames: number;
  totalSpentTime: number;
}

export interface Candidate extends RowDataPacket {
  id: string;
  postId: string;
  name: string;
  url: string;
  numberOfMatches: number;
  numberOfMatchesWon: number;
  numberOfGames: number;
  numberOfGamesWon: number;
  spentTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category extends RowDataPacket {
  id: number;
  name: string;
}

export interface Thumbnail extends RowDataPacket {
  id: string;
  postId: string;
  leftCandidateId: string;
  rightCandidateId: string;
}

export interface Comment extends RowDataPacket {
  id: string;
  postId: string;
  parentId: string;
  userId: string;
  nickname: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export function translateCategory(categoryName: string): string {
  switch (categoryName) {
    case 'animations':
      return '애니메이션';
    case 'athletes':
      return '운동선수';
    case 'celebrities':
      return '유명인';
    case 'idols':
      return '아이돌';
    case 'other':
      return '기타';
    default:
      return '오류';
  }
}

// ex : https://supabase.com/docs/guides/auth/users

export type SignupError = {
  username?: string[];
  email?: string[];
  nickname?: string[];
  password?: string[];
  confirmPassword?: string[];
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
  email: string;
  username: string;
  nickname: string;
}
