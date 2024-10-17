import {
  fetchCommentsByPostId,
  fetchPostStatById,
  fetchCandidatesByPostId,
} from '@/app/lib/data';
import RankScreen from '@/app/ui/ranks/RankScreen';
import { notFound } from 'next/navigation';
import Fold from '@/app/ui/fold/Fold';
import Link from 'next/link';
import CommentSection from '@/app/ui/comment/CommentSection';

interface Props {
  params: { id: string };
}

export default async function Page({ params }: Props) {
  const postId = params.id;
  const [postStatResult, candidates, comments] = await Promise.all([
    await fetchPostStatById(postId),
    await fetchCandidatesByPostId(postId),
    await fetchCommentsByPostId(postId),
  ]);

  if (postStatResult && postStatResult[0] && candidates) {
    const postStat = postStatResult[0];
    return (
      <div className='max-w-screen-xl m-auto'>
        <Fold postStat={postStat} />
        <div className='p-4'>
          <Link
            className='min-w-9 rounded-md border border-slate-300 py-2 px-3 text-center shadow-sm hover:shadow-md'
            href={`/posts/${postId}`}
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
