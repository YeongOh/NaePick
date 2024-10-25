'use server';

import { pool } from '../../db';

export async function createThumbnail(worldcupId: string) {
  // 월드컵이 만드는 함수에서 바로 이 함수가 호출되기에 인증, 인가 생략
  const [result, fields] = await pool.query(
    `INSERT INTO thumbnail (worldcup_id) 
        VALUES (?)`,
    [worldcupId]
  );
  console.log(result);
}
