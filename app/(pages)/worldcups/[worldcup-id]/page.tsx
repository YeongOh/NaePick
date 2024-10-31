import { getSession } from '@/app/lib/actions/session';
import { getWorldcupPickScreenByWorldcupId } from '@/app/lib/data/worldcups';
import CommentSection from '@/app/components/comment/comment-section';
import Fold from '@/app/components/fold';
import WorldcupPickScreen from '@/app/components/worldcups/worldcup-pick-screen';
import { notFound, redirect } from 'next/navigation';
import { getRandomCandidatesByWorldcupId } from '@/app/lib/data/candidates';
import { getCommentsByWorldcupId } from '@/app/lib/data/comments';
import WorldcupPickScreenSetter from '@/app/components/worldcups/worldcup-pick-screen-setter';

interface Props {
  params: { ['worldcup-id']: string };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const [worldcupResult, session] = await Promise.all([
    getWorldcupPickScreenByWorldcupId(worldcupId),
    getSession(),
  ]);

  if (!worldcupResult || !worldcupResult[0]) {
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
    </>
  );
}
