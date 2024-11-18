import { InferSelectModel } from 'drizzle-orm';

import { worldcups } from '../database/schema';

export type TCard = InferSelectModel<typeof worldcups> & {
  nickname: string | null;
  profilePath: string | null;
  leftName: string | null;
  leftPath: string | null;
  leftThumbnailUrl: string | null;
  leftMediaType: string | null;
  rightName: string | null;
  rightPath: string | null;
  rightThumbnailUrl: string | null;
  rightMediaType: string | null;
  categoryName: string;
};

interface PopularNextCursor {
  matchCount: number;
  createdAt: string;
}

export interface InfiniteScrollData<T> {
  data: T[];
  nextCursor: PopularNextCursor | number | null;
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
      return '잘못된 카테고리';
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
