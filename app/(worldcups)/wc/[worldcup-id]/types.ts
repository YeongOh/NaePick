import { z } from 'zod';
import { COMMENT_TEXT_MAX_LENGTH } from '@/app/constants';
import { Candidate, Comment, Worldcup } from '@/app/lib/database/model';

export type WorldcupMatchCandidate = Candidate & { mediaType: string };
export type WorldcupMatchWorldcup = Worldcup & {
  candidatesCount: number;
  profilePath: string | null;
  nickname: string | null;
};
export type WorldcupComment = Comment & {
  nickname: string | null;
  profilePath: string | null;
  voted: string | null;
  likeCount: number;
  replyCount?: number;
  isLiked?: string | null;
};
export type WorldcupMatchResult = { winnerId: string; loserId: string };
export type TCommentFormSchema = z.infer<typeof CommentFormSchema>;

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
