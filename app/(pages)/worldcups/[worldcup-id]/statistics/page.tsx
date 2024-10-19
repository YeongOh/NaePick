import {
  fetchCommentsByWorldcupId,
  fetchWorldcupByWorldcupId,
} from '@/app/lib/data/worldcups';
import StatisticsScreen from '@/app/components/statistics/statistics-screen';
import { notFound } from 'next/navigation';
import Fold from '@/app/components/fold/fold';
import Link from 'next/link';
import CommentSection from '@/app/components/comment/comment-section';
import { fetchCandidatesStatisticsByWorldcupId } from '@/app/lib/data/candidates';

interface Props {
  params: { ['worldcup-id']: string };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const [worldcupResult, candidatesStatistics, comments] = await Promise.all([
    await fetchWorldcupByWorldcupId(worldcupId),
    await fetchCandidatesStatisticsByWorldcupId(worldcupId),
    await fetchCommentsByWorldcupId(worldcupId),
  ]);

  if (worldcupResult && worldcupResult[0] && candidatesStatistics) {
    const worldcup = worldcupResult[0];
    return (
      <div className='max-w-screen-xl m-auto'>
        <Fold worldcup={worldcup} />
        <div className='p-4'>
          <Link
            className='min-w-9 rounded-md border border-slate-300 py-2 px-3 text-center shadow-sm hover:shadow-md'
            href={`/worldcups/${worldcupId}`}
          >
            월드컵 시작하기
          </Link>
        </div>
        <StatisticsScreen
          candidates={candidatesStatistics}
          worldcup={worldcup}
        />
        <CommentSection worldcupId={worldcupId} comments={comments} />
      </div>
    );
  } else {
    notFound();
  }
}
