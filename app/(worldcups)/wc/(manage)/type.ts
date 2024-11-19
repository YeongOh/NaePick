import { InferSelectModel } from 'drizzle-orm';
import { z } from 'zod';

import {
  CANDIDATE_ID_LENGTH,
  CANDIDATE_NAME_MAX_LENGTH,
  WORLDCUP_DESCRIPTION_MAX_LENGTH,
  WORLDCUP_TITLE_MAX_LENGTH,
  WORLDCUP_TITLE_MIN_LENGTH,
} from '@/app/constants';
import { categories, worldcups } from '@/app/lib/database/schema';

export type Category = InferSelectModel<typeof categories>;
export type EditingWorldcup = Partial<InferSelectModel<typeof worldcups>>;

export const WorldcupFormSchema = z.object({
  title: z
    .string()
    .min(WORLDCUP_TITLE_MIN_LENGTH, {
      message: `제목은 ${WORLDCUP_TITLE_MIN_LENGTH}자 이상이어야 합니다.`,
    })
    .max(WORLDCUP_TITLE_MAX_LENGTH, {
      message: `제목은 ${WORLDCUP_TITLE_MAX_LENGTH}자 이하여야 합니다.`,
    }),
  description: z
    .string()
    .max(WORLDCUP_DESCRIPTION_MAX_LENGTH, {
      message: `설명은 ${WORLDCUP_DESCRIPTION_MAX_LENGTH}자 이하여야 합니다.`,
    })
    .optional(),
  publicity: z.enum(['public', 'unlisted', 'private'], {
    invalid_type_error: '공개 범위를 선택해주세요.',
    required_error: '공개 범위를 선택해주세요.',
  }),
  categoryId: z.coerce.number({
    required_error: '카테고리를 선택해주세요.',
    invalid_type_error: '카테고리를 선택해주세요.',
  }),
});

export type TWorldcupFormSchema = z.infer<typeof WorldcupFormSchema>;

const candidateSchema = z.array(
  z.object({
    id: z
      .string()
      .min(1, { message: 'id가 발견되지 않았습니다.' })
      .max(CANDIDATE_ID_LENGTH, { message: '잘못된 id입니다.' }), // ID must be a non-empty string
    name: z
      .string()
      .min(1, { message: '이름을 입력해주세요' })
      .max(CANDIDATE_NAME_MAX_LENGTH, {
        message: `이름은 ${CANDIDATE_NAME_MAX_LENGTH}자 미만이어야 합니다.`,
      }),
  }),
);

export const CandidateDataSchema = z.object({
  candidates: candidateSchema,
});

export type TCandidateDataSchema = z.infer<typeof CandidateDataSchema>;
