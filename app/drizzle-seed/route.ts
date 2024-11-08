import { db } from '../lib/database';
import { categories } from '../lib/database/schema';

export async function GET() {
  try {
    [
      'animations',
      'athletes',
      'celebrities',
      'idols',
      'actors',
      'streamers',
      'songs',
      'webtoons',
      'manga',
      'singers',
      'youtubers',
      'other',
    ].forEach(async (name) => await db.insert(categories).values({ name }));

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
