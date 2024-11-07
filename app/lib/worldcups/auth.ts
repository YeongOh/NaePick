'use server';

import { FieldPacket } from 'mysql2';
import { redirect } from 'next/navigation';
import { Worldcup } from '../types';
import { db } from '../database';
import { deleteSession } from '../session';

export async function validateWorldcupOwnership(
  worldcupId: string,
  userId: string
) {
  const [worldcup, meta]: [Worldcup[], FieldPacket[]] = await db.query(
    `SELECT user_id as userId 
      FROM worldcup
      WHERE worldcup_id = ?`,
    [worldcupId]
  );

  if (!worldcup) {
    throw new Error('월드컵을 찾지 못했습니다.');
  }

  if (worldcup[0].userId !== userId) {
    await deleteSession();
    redirect('/auth/login');
  }

  return true;
}
