import {
  fetchCommentsByWorldcupId,
  fetchWorldcupStatsByWorldcupId,
  fetchCandidatesByWorldcupId,
} from '@/app/lib/data';
import RankScreen from '@/app/components/ranks/RankScreen';
import { notFound } from 'next/navigation';
import Fold from '@/app/components/fold/fold';
import Link from 'next/link';
import CommentSection from '@/app/components/comment/comment-section';

interface Props {
  params: { ['worldcup-id']: string };
}

export default async function Page({ params }: Props) {
  const postId = params['worldcup-id'];
  const [postStatResult, candidates, comments] = await Promise.all([
    await fetchWorldcupStatsByWorldcupId(postId),
    await fetchCandidatesByWorldcupId(postId),
    await fetchCommentsByWorldcupId(postId),
  ]);

  if (postStatResult && postStatResult[0] && candidates) {
    const postStat = postStatResult[0];
    return (
      <div className='max-w-screen-xl m-auto'>
        <Fold postStat={postStat} />
        <div className='p-4'>
          <Link
            className='min-w-9 rounded-md border border-slate-300 py-2 px-3 text-center shadow-sm hover:shadow-md'
            href={`/worldcups/${postId}`}
          >
            월드컵 시작하기
          </Link>
        </div>
        <RankScreen candidates={candidates} postStat={postStat} />
        <CommentSection postId={postId} comments={comments} />
      </div>
    );
  } else {
    notFound();
  }
}
