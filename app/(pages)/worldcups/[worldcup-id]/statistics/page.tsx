import {
  fetchCommentsByWorldcupId,
  fetchWorldcupByWorldcupId,
} from '@/app/lib/data/worldcups';
import StatisticsMain from '@/app/components/statistics/statistics-main';
import { notFound } from 'next/navigation';
import Fold from '@/app/components/fold/fold';
import CommentSection from '@/app/components/comment/comment-section';
import { fetchCandidatesStatisticsByWorldcupId } from '@/app/lib/data/candidates';
import { getSession } from '@/app/lib/actions/session';

interface Props {
  params: { ['worldcup-id']: string };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const [worldcupResult, candidatesStatistics, comments, session] =
    await Promise.all([
      fetchWorldcupByWorldcupId(worldcupId),
      fetchCandidatesStatisticsByWorldcupId(worldcupId),
      fetchCommentsByWorldcupId(worldcupId),
      getSession(),
    ]);

  if (worldcupResult && worldcupResult[0] && candidatesStatistics) {
    const worldcup = worldcupResult[0];
    return (
      <div className='max-w-screen-lg m-auto'>
        <StatisticsMain candidates={candidatesStatistics} worldcup={worldcup} />
        <Fold worldcup={worldcup} />
        <CommentSection
          worldcupId={worldcupId}
          session={structuredClone(session)}
          comments={comments}
        />
      </div>
    );
  } else {
    notFound();
  }
}
