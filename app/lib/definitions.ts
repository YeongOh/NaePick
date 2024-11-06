import { RowDataPacket as QueryResult } from 'mysql2';
import { SessionOptions } from 'iron-session';

export interface User extends QueryResult {
  userId: string;
  username: string;
  nickname: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface Worldcup extends QueryResult {
  worldcupId: string;
  title: string;
  description: string;
  publicity: Publicity;
  userId: string;
  categoryId: number;
  createdAt: string;
  numberOfCandidates: number;
  numberOfComments: number;
}

export interface WorldcupCard extends Worldcup {
  nickname: string;
  leftCandidateName: string;
  leftCandidatePathname: string;
  leftCandidateMediaType: MediaType;
  rightCandidateName: string;
  rightCandidatePathname: string;
  rightCandidateMediaType: MediaType;
}

export interface Candidate extends QueryResult {
  candidateId: string;
  worldcupId: string;
  name: string;
  pathname: string;
  mediaType: MediaType;
  createdAt: string;
  thumbnailURL?: string;
}

export interface CandidateWithStatistics extends Candidate {
  numberOfWins: number;
  numberOfLosses: number;
  numberOfTrophies: number;
  winRate: number;
}

export interface Category extends QueryResult {
  categoryId: number;
  name: string;
}

export interface Comment extends QueryResult {
  commentId: string;
  worldcupId: string;
  parentCommentId?: string;
  userId: string;
  nickname: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  isAnonymous: boolean;
  votedFor: string;
}

export interface InfiniteScrollData<T, V> {
  data: T[] | null;
  cursor: V | null;
}

export interface MatchResult {
  winnerCandidateId: string;
  loserCandidateId: string;
}

export type MediaType = 'cdn_img' | 'cdn_video' | 'youtube' | 'chzzk';

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
      return '연예인';
    case 'idols':
      return '아이돌';
    case 'other':
      return '기타';
    case 'actors':
      return '배우';
    case 'streamers':
      return '스트리머';
    case 'songs':
      return '노래';
    case 'manga':
      return '만화';
    case 'singers':
      return '가수';
    case 'webtoons':
      return '웹툰';
    case 'youtubers':
      return '유튜버';
    default:
      return '오류';
  }
}

export function translatePublicity(publicity: string): string {
  switch (publicity) {
    case 'public':
      return '전체 공개';
    case 'unlisted':
      return '미등록';
    case 'private':
      return '비공개';
    default:
      return '오류';
  }
}

// ex : https://supabase.com/docs/guides/auth/users

const sevenDays = 60 * 60 * 24 * 7;

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: 'iron',
  ttl: sevenDays,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: sevenDays - 60,
  },
};

export interface SessionData {
  userId: string;
  nickname: string;
}
