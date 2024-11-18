import 'server-only';
import { eq, getTableColumns } from 'drizzle-orm';

import { db } from '../database';
import { categories, worldcups } from '../database/schema';

export async function getCategoriesForSearch() {
  try {
    const result = await db
      .select({
        ...getTableColumns(categories),
        categoryCount: db.$count(worldcups, eq(worldcups.categoryId, categories.id)),
      })
      .from(categories);

    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function getCategories() {
  try {
    return await db.select().from(categories);
  } catch (error) {
    console.error(error);
  }
}
