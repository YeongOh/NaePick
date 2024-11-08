import 'server-only';
import { desc, eq } from 'drizzle-orm';
import { db } from '../database';
import { candidates, mediaTypes } from '../database/schema';
import { CANDIDATE_ID_LENGTH } from '@/app/constants';
import { nanoid } from 'nanoid';

export async function getCandidatesForUpdate(worldcupId: string, page: number) {
  try {
    const DATA_PER_PAGE = 10;

    const result = await db
      .select({
        id: candidates.id,
        name: candidates.name,
        path: candidates.path,
        thumbnailUrl: candidates.thumbnailUrl,
        mediaType: mediaTypes.name,
        createdAt: candidates.createdAt,
      })
      .from(candidates)
      .innerJoin(mediaTypes, eq(candidates.mediaTypeId, mediaTypes.id))
      .where(eq(candidates.worldcupId, worldcupId))
      .orderBy(desc(candidates.createdAt))
      .limit(DATA_PER_PAGE)
      .offset((page - 1) * DATA_PER_PAGE);

    const count = await db.$count(candidates, eq(candidates.worldcupId, worldcupId));

    return { candidates: result, count };
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
