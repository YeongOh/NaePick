import { getSession } from '@/app/lib/actions/session';
import {
  getWorldcupByWorldcupId,
  getWorldcupCardByWorldcupId,
} from '@/app/lib/data/worldcups';
import CommentSection from '@/app/components/comment/comment-section';
import Fold from '@/app/components/fold/fold';
import WorldcupPickScreen from '@/app/components/worldcups/worldcup-pick-screen';
import { notFound, redirect } from 'next/navigation';
import { getRandomCandidatesByWorldcupId } from '@/app/lib/data/candidates';
import { getCommentsByWorldcupId } from '@/app/lib/data/comments';

interface Props {
  params: { ['worldcup-id']: string; rounds: string };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const rounds = Number(params.rounds);
  const [worldcupResult, candidates, session, comments] = await Promise.all([
    getWorldcupByWorldcupId(worldcupId),
    getRandomCandidatesByWorldcupId(worldcupId, rounds),
    getSession(),
    getCommentsByWorldcupId(worldcupId),
  ]);

  if (!worldcupResult || !candidates) {
    notFound();
  }

  if (
    worldcupResult[0].publicity === 'private' &&
    session.userId !== worldcupResult[0].userId
  ) {
    redirect('/forbidden');
  }

  return (
    <>
      <WorldcupPickScreen
        defaultCandidates={candidates}
        worldcup={worldcupResult[0]}
        startingRound={rounds}
      />
      <div className='max-w-screen-lg m-auto'>
        <Fold worldcup={worldcupResult[0]} />
        <CommentSection
          worldcupId={worldcupId}
          session={structuredClone(session)}
          comments={comments}
        />
      </div>
    </>
  );
}
