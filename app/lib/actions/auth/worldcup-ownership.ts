'use server';

import { FieldPacket } from 'mysql2';
import { pool } from '../../db';
import { Worldcup } from '../../definitions';
import { getSession } from '../session';

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

  if (!worldcup || worldcup[0].userId !== userId) {
    throw new Error('권한이 없습니다.');
  }

  return true;
}
