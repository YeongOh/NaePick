import { db } from '../lib/database';
import { categories, mediaTypes } from '../lib/database/schema';

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

    ['cdn_img', 'cdn_video', 'youtube', 'chzzk', 'imgur'].forEach(
      async (name) => await db.insert(mediaTypes).values({ name })
    );

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
