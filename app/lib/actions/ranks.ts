'use server';

import { pool } from '../db';

export async function sendStats(
  postId: string,
  winners: any,
  losers: any,
  finalWinner: any,
  spentTimes: number[]
) {
  try {
    const visitedId = new Set();

    winners.forEach(async (winner: any, i: number) => {
      if (visitedId.has(winner.id)) {
        const [results, fields] = await pool.query(
          `
            UPDATE Candidates
            SET numberOfMatches = numberOfMatches + 1,
                numberOfMatchesWon = numberOfMatchesWon + 1,
                spentTime = spentTime + ?
            WHERE Candidates.postId = ? AND Candidates.id = ?;
            `,
          [spentTimes[i], postId, winner.id]
        );
      } else {
        visitedId.add(winner.id);
        const [results, fields] = await pool.query(
          `
            UPDATE Candidates
            SET numberOfMatches = numberOfMatches + 1,
                numberOfMatchesWon = numberOfMatchesWon + 1,
                numberOfGames = numberOfGames + 1,
                spentTime = spentTime + ?
            WHERE Candidates.postId = ? AND Candidates.id = ?;
            `,
          [spentTimes[i], postId, winner.id]
        );
      }
    });

    losers.forEach(async (loser: any, i: number) => {
      if (visitedId.has(loser.id)) {
        const [results, fields] = await pool.query(
          `
            UPDATE Candidates
            SET numberOfMatches = numberOfMatches + 1,
                spentTime = spentTime + ?
            WHERE Candidates.postId = ? AND Candidates.id = ?;
            `,
          [spentTimes[i], postId, loser.id]
        );
      } else {
        visitedId.add(loser.id);
        const [results, fields] = await pool.query(
          `
            UPDATE Candidates
            SET numberOfMatches = numberOfMatches + 1,
                numberOfGames = numberOfGames + 1,
                spentTime = spentTime + ?
            WHERE Candidates.postId = ? AND Candidates.id = ?;
            `,
          [spentTimes[i], postId, loser.id]
        );
      }
    });

    const [results, fields] = await pool.query(
      `
          UPDATE Candidates
          SET numberOfGamesWon = numberOfGamesWon + 1
          WHERE Candidates.postId = ? AND Candidates.id = ?;
          `,
      [postId, finalWinner.id]
    );

    const totalSpentTime = spentTimes.reduce((prev, curr) => prev + curr, 0);
    const totalNumberOfMatches = winners.length;
    const [postStatResult, postStatField] = await pool.query(
      `
          UPDATE PostStats
          SET numberOfMatches = numberOfMatches + ?,
              numberOfGames = numberOfGames + 1,
              totalSpentTime = totalSpentTime + ?
          WHERE PostStats.postId = ?;
          `,
      [totalNumberOfMatches, totalSpentTime, postId]
    );
    console.log(postStatResult);

    console.log(winners);
    console.log(losers);
    console.log(spentTimes);
    console.log(finalWinner);
  } catch (err) {
    console.log(err);
  }
}
