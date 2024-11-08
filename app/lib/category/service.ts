import 'server-only';
import { FieldPacket } from 'mysql2';
import { Category } from '../types';
import { db } from '../database';
import { categories } from '../database/schema';

// export async function getAllCategoriesWithCategoryCount() {
//   try {
//     const [result, meta]: [
//       (Category & { categoryCount: number })[],
//       FieldPacket[]
//     ] = await db.query(
//       `SELECT c.category_id as categoryId,
//                 c.name as name,
//                 COALESCE(wc.category_count, 0) as categoryCount
//         FROM category c
//         LEFT JOIN
//          (SELECT w.category_id, count(w.category_id) AS category_count
//          FROM worldcup w GROUP BY w.category_id) wc on wc.category_id = c.category_id;`
//     );

//     return result;
//   } catch (err) {
//     console.log(err);
//   }
// }

export async function getAllCategories() {
  try {
    return await db.select().from(categories);
  } catch (error) {
    console.error(error);
  }
}
