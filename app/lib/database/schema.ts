import {
  int,
  mysqlEnum,
  mysqlTable,
  smallint,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/mysql-core';

export const worldcup = mysqlTable('worldcup', {
  id: varchar({ length: 10 }).primaryKey(),
  title: varchar({ length: 10 }).notNull(),
  description: varchar({ length: 500 }),
  publicity: mysqlEnum(['public', 'private', 'unlisted'])
    .notNull()
    .default('public'),
  userId: varchar({ length: 10 }),
  categoryId: smallint().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().onUpdateNow().defaultNow(),
});

export const user = mysqlTable('user', {
  id: varchar({ length: 10 }).primaryKey(),
  nickname: varchar({ length: 20 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  profilePath: varchar({ length: 50 }),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().onUpdateNow().defaultNow(),
});
