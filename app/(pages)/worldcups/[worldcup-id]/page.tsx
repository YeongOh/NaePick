import { getSession } from '@/app/lib/actions/session';
import { getWorldcupPickScreenByWorldcupId } from '@/app/lib/data/worldcups';
import CommentSection from '@/app/components/comment/comment-section';
import Fold from '@/app/components/fold/fold';
import WorldcupPickScreen from '@/app/components/worldcups/worldcup-pick-screen';
import { notFound, redirect } from 'next/navigation';
import { getRandomCandidatesByWorldcupId } from '@/app/lib/data/candidates';
import { getCommentsByWorldcupId } from '@/app/lib/data/comments';
import WorldcupPickScreenSetter from '@/app/components/worldcups/worldcup-pick-screen-setter';

interface Props {
  params: { ['worldcup-id']: string; rounds: string };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const rounds = Number(params.rounds);
  const [worldcupResult, comments, session] = await Promise.all([
    getWorldcupPickScreenByWorldcupId(worldcupId),
    getCommentsByWorldcupId(worldcupId),
    getSession(),
  ]);

  if (!worldcupResult) {
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
      <WorldcupPickScreenSetter worldcup={worldcupResult[0]} />
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
