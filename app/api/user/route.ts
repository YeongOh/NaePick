import { db } from '@/app/lib/database';
import { SessionData, sessionOptions } from '@/app/lib/types';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const userId = session.userId;

  try {
    const [result] = await db.query(
      'SELECT email FROM user WHERE user_id = ?',
      [userId]
    );

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { email } = result[0];

    return new Response(JSON.stringify({ email }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
