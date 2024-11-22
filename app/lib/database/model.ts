import { InferSelectModel } from 'drizzle-orm';
import {
  candidates,
  categories,
  comments,
  matchResults,
  mediaTypes,
  sessions,
  users,
  worldcups,
} from './schema';

export type Worldcup = InferSelectModel<typeof worldcups>;
export type Category = InferSelectModel<typeof categories>;
export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;
export type Candidate = InferSelectModel<typeof candidates>;
export type MediaType = InferSelectModel<typeof mediaTypes>;
export type Comment = InferSelectModel<typeof comments>;
export type MatchResult = InferSelectModel<typeof matchResults>;
