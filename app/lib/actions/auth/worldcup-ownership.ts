'use server';

import { FieldPacket } from 'mysql2';
import { pool } from '../../db';
import { Worldcup } from '../../definitions';
import { redirect } from 'next/navigation';
import { deleteSession } from '../session';

export async function validateWorldcupOwnership(
  worldcupId: string,
  userId: string
) {
  const [worldcup, meta]: [Worldcup[], FieldPacket[]] = await pool.query(
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
    redirect('/signin');
  }

  return true;
}
