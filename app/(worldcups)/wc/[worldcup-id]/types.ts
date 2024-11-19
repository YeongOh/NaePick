import { InferSelectModel } from 'drizzle-orm';

import { z } from 'zod';
import { COMMENT_TEXT_MAX_LENGTH } from '@/app/constants';
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

export const CommentFormSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, {
      message: '내용을 입력해주세요.',
    })
    .max(COMMENT_TEXT_MAX_LENGTH, {
      message: `내용은 ${COMMENT_TEXT_MAX_LENGTH}자 이하여야 합니다.`,
    }),
});

export type TCommentFormSchema = z.infer<typeof CommentFormSchema>;
