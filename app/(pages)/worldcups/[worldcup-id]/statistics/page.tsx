import { getWorldcupPickScreenByWorldcupId } from '@/app/lib/data/worldcups';
import StatisticsMain from '@/app/components/statistics/statistics-main';
import { notFound } from 'next/navigation';
import Fold from '@/app/components/fold/fold';
import CommentSection from '@/app/components/comment/comment-section';
import { getCandidatesStatisticsByWorldcupId } from '@/app/lib/data/candidates';
import { getSession } from '@/app/lib/actions/session';
import { getCommentsByWorldcupId } from '@/app/lib/data/comments';

interface Props {
  params: { ['worldcup-id']: string };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const [worldcupResult, candidatesStatistics, comments, session] =
    await Promise.all([
      getWorldcupPickScreenByWorldcupId(worldcupId),
      getCandidatesStatisticsByWorldcupId(worldcupId),
      getCommentsByWorldcupId(worldcupId),
      getSession(),
    ]);

  if (worldcupResult && worldcupResult[0] && candidatesStatistics) {
    const worldcup = worldcupResult[0];
    return (
      <>
        <StatisticsMain candidates={candidatesStatistics} worldcup={worldcup} />
        <div className='max-w-screen-lg m-auto'>
          <Fold worldcup={worldcup} />
          <CommentSection
            worldcupId={worldcupId}
            session={structuredClone(session)}
            comments={comments}
          />
        </div>
      </>
    );
  } else {
    notFound();
  }
}
