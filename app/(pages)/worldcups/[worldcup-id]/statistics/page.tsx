import { getWorldcupPickScreenByWorldcupId } from '@/app/lib/data/worldcups';
import StatisticsMain from '@/app/components/statistics/statistics-main';
import { notFound } from 'next/navigation';
import Fold from '@/app/components/fold';
import CommentSection from '@/app/components/comment/comment-section';
import { getSession } from '@/app/lib/actions/session';
import { getCommentsByWorldcupId } from '@/app/lib/data/comments';
import { getCandidateStatisticsByWorldcupId } from '@/app/lib/data/statistics';

interface Props {
  params: { ['worldcup-id']: string };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const [worldcupResult, candidatesStatistics, comments, session] =
    await Promise.all([
      getWorldcupPickScreenByWorldcupId(worldcupId),
      getCandidateStatisticsByWorldcupId(worldcupId),
      getCommentsByWorldcupId(worldcupId),
      getSession(),
    ]);

  if (worldcupResult && worldcupResult[0] && candidatesStatistics) {
    const worldcup = worldcupResult[0];
    return (
      <>
        <div className='bg-gray-50'>
          <div className='bg-white max-w-screen-lg m-auto'>
            <Fold worldcup={worldcup} />
            <StatisticsMain
              candidates={candidatesStatistics}
              worldcup={worldcup}
            />

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
