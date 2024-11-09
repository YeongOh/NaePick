import 'server-only';
import { and, desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from '../database';
import { candidates, games, mediaTypes } from '../database/schema';
import { CANDIDATE_ID_LENGTH } from '@/app/constants';
import { nanoid } from 'nanoid';

export async function getCandidatesForUpdate(worldcupId: string, page: number) {
  try {
    const DATA_PER_PAGE = 10;

    const data = await db
      .select({
        ...getTableColumns(candidates),
        mediaType: mediaTypes.name,
      })
      .from(candidates)
      .innerJoin(mediaTypes, eq(candidates.mediaTypeId, mediaTypes.id))
      .where(eq(candidates.worldcupId, worldcupId))
      .orderBy(desc(candidates.createdAt))
      .limit(DATA_PER_PAGE)
      .offset((page - 1) * DATA_PER_PAGE);

    const count = await db.$count(candidates, eq(candidates.worldcupId, worldcupId));

    return { data, count };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCandidatesForStat(worldcupId: string, page: number) {
  try {
    const DATA_PER_PAGE = 10;

    const stat = db.$with('stat').as(
      db
        .select({
          id: candidates.id,
          name: sql<string>`${candidates.name}`.as('name'),
          path: candidates.path,
          thumbnailUrl: candidates.thumbnailUrl,
          mediaType: sql<string>`${mediaTypes.name}`.as('mediaType'),
          winCount: db.$count(games, eq(games.winnerId, candidates.id)).as('winCount'),
          lossCount: db.$count(games, eq(games.loserId, candidates.id)).as('lossCount'),
          trophyCount: db
            .$count(games, and(eq(games.winnerId, candidates.id), eq(games.isFinalGame, true)))
            .as('trophyCount'),
        })
        .from(candidates)
        .innerJoin(mediaTypes, eq(mediaTypes.id, candidates.mediaTypeId))
        .where(eq(candidates.worldcupId, worldcupId))
    );

    const result = await db
      .with(stat)
      .select({
        id: stat.id,
        name: stat.name,
        path: stat.path,
        thumbnailUrl: stat.thumbnailUrl,
        mediaType: stat.mediaType,
        winCount: stat.winCount,
        lossCount: stat.lossCount,
        winRate: sql<number>` CASE WHEN winCount + lossCount = 0 THEN 0 
                      ELSE CAST(winCount AS FLOAT) / (winCount + lossCount) END`.as('winRate'),
      })
      .from(stat)
      .orderBy(sql`winRate DESC`)
      .limit(DATA_PER_PAGE)
      .offset((page - 1) * DATA_PER_PAGE);

    const statCount = await db.$count(candidates, eq(candidates.worldcupId, worldcupId));

    return { data: result, count: statCount };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createCandidate({
  worldcupId,
  name,
  path,
  mediaType,
  thumbnailUrl,
}: {
  worldcupId: string;
  name: string;
  path: string;
  mediaType: string;
  thumbnailUrl?: string;
}) {
  try {
    const [mediaTypeResult] = await db
      .select({ mediaTypeId: mediaTypes.id })
      .from(mediaTypes)
      .where(eq(mediaTypes.name, mediaType));

    const mediaTypeId = mediaTypeResult.mediaTypeId;

    await db.insert(candidates).values({
      id: nanoid(CANDIDATE_ID_LENGTH),
      thumbnailUrl: thumbnailUrl || null,
      name,
      path,
      worldcupId,
      mediaTypeId,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateCandidate({
  candidateId,
  path,
  mediaType,
  thumbnailUrl,
}: {
  candidateId: string;
  path: string;
  mediaType: string;
  thumbnailUrl?: string;
}) {
  try {
    const [mediaTypeResult] = await db
      .select({ mediaTypeId: mediaTypes.id })
      .from(mediaTypes)
      .where(eq(mediaTypes.name, mediaType));

    const mediaTypeId = mediaTypeResult.mediaTypeId;

    await db
      .update(candidates)
      .set({
        thumbnailUrl: thumbnailUrl || null,
        path,
        mediaTypeId,
      })
      .where(eq(candidates.id, candidateId));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateCandidateNames(candidateNames: { id: string; name: string }[]) {
  try {
    const promises = candidateNames.map(({ id, name }) =>
      db.update(candidates).set({ name }).where(eq(candidates.id, id))
    );
    await Promise.allSettled(promises);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteCandidate(candidateId: string) {
  try {
    await db.delete(candidates).where(eq(candidates.id, candidateId));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCandidateName(candidateId: string) {
  try {
    const result = await db
      .select({ name: candidates.name })
      .from(candidates)
      .where(eq(candidates.id, candidateId));

    return result[0]?.name || null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
