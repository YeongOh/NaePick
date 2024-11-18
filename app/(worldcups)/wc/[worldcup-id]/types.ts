import { InferSelectModel } from 'drizzle-orm';

import { candidates, comments, worldcups } from '@/app/lib/database/schema';

export type WorldcupMatchCandidate = InferSelectModel<typeof candidates> & { mediaType: string };

export type WorldcupMatchWorldcup = InferSelectModel<typeof worldcups> & {
  candidatesCount: number;
  profilePath: string | null;
  nickname: string | null;
};

export type WorldcupMatchResult = { winnerId: string; loserId: string };

export type WorldcupComment = InferSelectModel<typeof comments> & {
  nickname: string | null;
  profilePath: string | null;
  voted: string | null;
  likeCount: number;
  replyCount?: number;
  isLiked?: string | null;
};
