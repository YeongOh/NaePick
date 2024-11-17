import { candidates, worldcups } from '@/app/lib/database/schema';
import { InferSelectModel } from 'drizzle-orm';

export type WorldcupMatchCandidate = InferSelectModel<typeof candidates> & { mediaType: string };

export type WorldcupMatchWorldcup = InferSelectModel<typeof worldcups> & {
  candidatesCount: number;
  profilePath: string | null;
  nickname: string | null;
};

export type WorldcupMatchResult = { winnerId: string; loserId: string };
