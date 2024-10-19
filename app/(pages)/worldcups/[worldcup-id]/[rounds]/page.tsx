import { getSession } from '@/app/lib/actions/session';
import {
  fetchCommentsByWorldcupId,
  fetchWorldcupByWorldcupId,
} from '@/app/lib/data/worldcups';
import CommentSection from '@/app/components/comment/comment-section';
import Fold from '@/app/components/fold/fold';
import WorldcupScreen from '@/app/components/worldcups/worldcup-screen';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { fetchRandomCandidatesByWorldcupId } from '@/app/lib/data/candidates';

interface Props {
  params: { ['worldcup-id']: string; rounds: string };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const rounds = Number(params.rounds);
  const [worldcupResult, candidates, session, comments] = await Promise.all([
    fetchWorldcupByWorldcupId(worldcupId),
    fetchRandomCandidatesByWorldcupId(worldcupId, rounds),
    getSession(),
    fetchCommentsByWorldcupId(worldcupId),
  ]);

  if (worldcupResult && worldcupResult[0]) {
    if (
      worldcupResult[0].publicity === 'private' &&
      session.userId !== worldcupResult[0].userId
    ) {
      redirect('/forbidden');
    }

    return (
      <>
        <WorldcupScreen
          defaultCandidates={candidates}
          worldcup={worldcupResult[0]}
          startingRound={rounds}
        />
        <div className='max-w-screen-2xl m-auto'>
          <div className='p-8'>
            <Fold worldcup={worldcupResult[0]} />
          </div>
          <div className='p-8'>
            <CommentSection
              worldcupId={worldcupId}
              session={structuredClone(session)}
              comments={comments}
            />
          </div>
        </div>
      </>
    );
  } else {
    notFound();
  }
}
