import { InferInsertModel } from 'drizzle-orm';
import { sessions } from '../database/schema';

export type SessionInsert = InferInsertModel<typeof sessions>;
