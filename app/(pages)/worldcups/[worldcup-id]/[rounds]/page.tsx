import { getSession } from '@/app/lib/actions/session';
import {
  fetchRandomCandidatesByWorldcupId,
  fetchCommentsByWorldcupId,
  fetchWorldcupInfoByWorldcupId,
} from '@/app/lib/data';
import CommentSection from '@/app/components/comment/comment-section';
import Fold from '@/app/components/fold/fold';
import PickScreen from '@/app/components/worldcups/pick-screen';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

interface Props {
  params: { ['worldcup-id']: string; rounds: string };
}

export default async function Page({ params }: Props) {
  const postId = params['worldcup-id'];
  const rounds = Number(params.rounds);
  const [postResult, candidates, session, comments] = await Promise.all([
    fetchWorldcupInfoByWorldcupId(postId),
    fetchRandomCandidatesByWorldcupId(postId, rounds),
    getSession(),
    fetchCommentsByWorldcupId(postId),
  ]);

  if (postResult && postResult[0]) {
    if (
      postResult[0].publicity === 'private' &&
      session.id !== postResult[0].userId
    ) {
      redirect('/forbidden');
    }

    return (
      <>
        <PickScreen
          defaultCandidates={candidates}
          post={postResult[0]}
          postId={postId}
          round={rounds}
        />
        <Fold postStat={postResult[0]} />
        <div className='p-4 mb-4'>
          <Link
            className='min-w-9 rounded-md border border-slate-300 py-2 px-3 text-center shadow-sm hover:shadow-md'
            href={`/worldcups/${postId}/statistics`}
          >
            통계 보기
          </Link>
        </div>
        <CommentSection
          postId={postId}
          session={structuredClone(session)}
          comments={comments}
        />
      </>
    );
  } else {
    notFound();
  }
}
