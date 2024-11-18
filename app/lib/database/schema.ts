import {
  CANDIDATE_ID_LENGTH,
  CANDIDATE_NAME_MAX_LENGTH,
  COMMENT_ID_LENGTH,
  COMMENT_TEXT_MAX_LENGTH,
  NICKNAME_MAX_LENGTH,
  USER_ID_LENGTH,
  WORLDCUP_DESCRIPTION_MAX_LENGTH,
  WORLDCUP_ID_LENGTH,
  WORLDCUP_TITLE_MAX_LENGTH,
} from '@/app/constants';
import { InferInsertModel } from 'drizzle-orm';
import {
  mysqlEnum,
  mysqlTable as table,
  smallint,
  timestamp,
  varchar,
  boolean,
  AnyMySqlColumn,
  int,
  primaryKey,
} from 'drizzle-orm/mysql-core';

export const worldcups = table('worldcups', {
  id: varchar({ length: WORLDCUP_ID_LENGTH }).primaryKey(),
  title: varchar({ length: WORLDCUP_TITLE_MAX_LENGTH }).notNull(),
  description: varchar({ length: WORLDCUP_DESCRIPTION_MAX_LENGTH }),
  publicity: mysqlEnum(['public', 'private', 'unlisted']).notNull().default('public'),
  userId: varchar({ length: USER_ID_LENGTH }).references(() => users.id, { onDelete: 'set null' }),
  categoryId: smallint()
    .notNull()
    .references(() => categories.id),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().onUpdateNow().defaultNow(),
});

export const categories = table('categories', {
  id: smallint().primaryKey().autoincrement(),
  name: varchar({ length: 20 }).notNull().unique(),
});

export const users = table('users', {
  id: varchar({ length: USER_ID_LENGTH }).primaryKey(),
  nickname: varchar({ length: NICKNAME_MAX_LENGTH }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  profilePath: varchar({ length: 50 }),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().onUpdateNow().defaultNow(),
});

export const sessions = table('sessions', {
  id: varchar('id', {
    length: 255,
  }).primaryKey(),
  userId: varchar({ length: USER_ID_LENGTH })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().onUpdateNow().defaultNow(),
  expiresAt: timestamp({ mode: 'string' }).notNull(),
});

export const candidates = table('candidates', {
  id: varchar({ length: CANDIDATE_ID_LENGTH }).primaryKey(),
  name: varchar({ length: CANDIDATE_NAME_MAX_LENGTH }).notNull(),
  path: varchar({ length: 255 }).notNull(),
  thumbnailUrl: varchar({ length: 255 }),
  worldcupId: varchar({ length: WORLDCUP_ID_LENGTH })
    .notNull()
    .references(() => worldcups.id, { onDelete: 'cascade' }),
  mediaTypeId: smallint()
    .notNull()
    .references(() => mediaTypes.id),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().onUpdateNow().defaultNow(),
});

export const mediaTypes = table('media_types', {
  id: smallint().primaryKey().autoincrement(),
  name: varchar({ length: 20 }).notNull().unique(),
});

export const comments = table('comments', {
  id: varchar({ length: COMMENT_ID_LENGTH }).primaryKey(),
  text: varchar({ length: COMMENT_TEXT_MAX_LENGTH }).notNull(),
  parentId: varchar({ length: COMMENT_ID_LENGTH }).references((): AnyMySqlColumn => comments.id, {
    onDelete: 'cascade',
  }),
  userId: varchar({ length: USER_ID_LENGTH }).references(() => users.id, { onDelete: 'set null' }),
  worldcupId: varchar({ length: WORLDCUP_ID_LENGTH })
    .notNull()
    .references(() => worldcups.id, { onDelete: 'cascade' }),
  candidateId: varchar({ length: CANDIDATE_ID_LENGTH }).references(() => candidates.id, {
    onDelete: 'set null',
  }),
  isAnonymous: boolean().notNull().default(false),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().onUpdateNow().defaultNow(),
});

export const matchResults = table('match_result', {
  id: int().primaryKey().autoincrement(),
  worldcupId: varchar({ length: WORLDCUP_ID_LENGTH })
    .notNull()
    .references(() => worldcups.id, { onDelete: 'cascade' }),
  winnerId: varchar({ length: CANDIDATE_ID_LENGTH })
    .notNull()
    .references(() => candidates.id, { onDelete: 'cascade' }),
  loserId: varchar({ length: CANDIDATE_ID_LENGTH })
    .notNull()
    .references(() => candidates.id, { onDelete: 'cascade' }),
  isFinalMatch: boolean().notNull().default(false),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
});

export const commentLikes = table(
  'comment_likes',
  {
    commentId: varchar({ length: COMMENT_ID_LENGTH })
      .notNull()
      .references(() => comments.id, { onDelete: 'cascade' }),
    userId: varchar({ length: USER_ID_LENGTH })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  },
  (table) => {
    return {
      pk: [primaryKey({ columns: [table.commentId, table.userId] })],
    };
  },
);
