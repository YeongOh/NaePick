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
  matchCount: number;
};

export interface PopularNextCursor {
  matchCount: number;
  createdAt: string;
}

export interface InfiniteScrollData<T> {
  data: T[];
  nextCursor: PopularNextCursor | number | null;
}

export type MediaType = 'cdn_img' | 'cdn_video' | 'youtube' | 'chzzk';

export type Publicity = 'public' | 'private' | 'unlisted';
