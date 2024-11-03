import { getSession } from '@/app/lib/actions/session';
import { getWorldcupPickScreenByWorldcupId } from '@/app/lib/data/worldcups';
import { notFound, redirect } from 'next/navigation';
import { getCommentsByWorldcupId } from '@/app/lib/data/comments';
import WorldcupPickScreenSetter from '@/app/components/worldcups/worldcup-pick-screen-setter';
import { Comment, InfiniteScrollData } from '@/app/lib/definitions';

interface Props {
  params: { ['worldcup-id']: string };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const [worldcupResult, commentData, session] = await Promise.all([
    getWorldcupPickScreenByWorldcupId(worldcupId),
    getCommentsByWorldcupId(worldcupId),
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
      <WorldcupPickScreenSetter
        worldcup={worldcupResult[0]}
        commentData={commentData as InfiniteScrollData<Comment>}
      />
    </>
  );
}
