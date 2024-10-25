import { RowDataPacket as QueryResult } from 'mysql2';
import { SessionOptions } from 'iron-session';

export interface User extends QueryResult {
  userId: string;
  username: string;
  nickname: string;
  role: 'user' | 'admin';
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface Worldcup extends QueryResult {
  worldcupId: string;
  title: string;
  description: string;
  publicity: 'public' | 'unlisted' | 'private';
  userId: string;
  categoryId: number;
  createdAt: string;
}

export interface WorldcupCard extends Worldcup {
  nickname: string;
  leftCandidateName: string;
  rightCandidateName: string;
  leftCandidateUrl: string;
  rightCandidateUrl: string;
}

export interface Candidate extends QueryResult {
  candidateId: string;
  worldcupId: string;
  name: string;
  url: string;
  createdAt: string;
}

export interface CandidateWithStatistics extends Candidate {
  numberOfWins: number;
  numberOfLosses: number;
  numberOfTrophies: number;
}

export interface Category extends QueryResult {
  categoryId: number;
  name: string;
}

export interface Thumbnail extends QueryResult {
  thumbnailId: string;
  worldcupId: string;
  leftCandidateId: string;
  rightCandidateId: string;
}

export interface Comment extends QueryResult {
  commentId: string;
  worldcupId: string;
  parentCommentId: string;
  userId: string;
  nickname: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchResult {
  winnerCandidateId: string;
  loserCandidateId: string;
}

export type Publicity = 'public' | 'private' | 'unlisted';

export const publicityText: { [key in Publicity]: string } = {
  public: '모두에게 공개 됩니다.',
  unlisted: '링크를 가지고 있는 사용자만 볼 수 있습니다.',
  private: '만든 사용자만 볼 수 있습니다.',
};

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

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: 'iron',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export interface SessionData {
  userId: string;
  email: string;
  nickname: string;
}
