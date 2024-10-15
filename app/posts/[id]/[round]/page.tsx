import { getSession } from '@/app/lib/actions/session';
import {
  fetchRandomCandidatesByPostId,
  fetchCommentsByPostId,
  fetchPostByPostId,
} from '@/app/lib/data';
import CommentSection from '@/app/ui/comment/CommentSection';
import Fold from '@/app/ui/fold/Fold';
import PickScreen from '@/app/ui/posts/PickScreen';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string; round: string };
}

export default async function Page({ params }: Props) {
  const postId = params.id;
  const round = Number(params.round);
  const [postResult, candidates, session, comments] = await Promise.all([
    await fetchPostByPostId(postId),
    await fetchRandomCandidatesByPostId(postId, round),
    await getSession(),
    await fetchCommentsByPostId(postId),
  ]);

  if (postResult && postResult[0]) {
    if (
      postResult[0].publicity === 'private' &&
      session.id !== postResult[0].userId
    ) {
      return <div>비공개 이상형 월드컵입니다.</div>;
    }

    return (
      <>
        <PickScreen
          defaultCandidates={candidates}
          post={postResult[0]}
          postId={postId}
          round={round}
        />
        <Fold postStat={postResult[0]} />
        <div className='p-4 mb-4'>
          <Link
            className='min-w-9 rounded-md border border-slate-300 py-2 px-3 text-center shadow-sm hover:shadow-md'
            href={`/posts/ranks/${postId}`}
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
