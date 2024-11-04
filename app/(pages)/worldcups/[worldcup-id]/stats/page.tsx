import { getWorldcupPickScreenByWorldcupId } from '@/app/lib/data/worldcups';
import StatisticsMain from '@/app/components/statistics/statistics-main';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/app/lib/actions/session';
import { getCommentsByWorldcupId } from '@/app/lib/data/comments';
import { getCandidateStatisticsByWorldcupIdAndPageNumber } from '@/app/lib/data/statistics';
import { Comment, InfiniteScrollData } from '@/app/lib/definitions';

interface Props {
  params: { ['worldcup-id']: string };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const [worldcupResult, candidatesStatistics, commentsData, session] =
    await Promise.all([
      getWorldcupPickScreenByWorldcupId(worldcupId),
      getCandidateStatisticsByWorldcupIdAndPageNumber(worldcupId, 1),
      getCommentsByWorldcupId(worldcupId),
      getSession(),
    ]);

  if (
    worldcupResult &&
    worldcupResult[0] &&
    candidatesStatistics &&
    commentsData
  ) {
    const worldcup = worldcupResult[0];
    if (
      worldcup.publicity === 'private' &&
      worldcup.userId !== session?.userId
    ) {
      redirect('/forbidden');
    }

    return (
      <div>
        <StatisticsMain
          candidates={candidatesStatistics}
          worldcup={worldcup}
          commentData={commentsData as InfiniteScrollData<Comment>}
        />
      </div>
    );
  } else {
    notFound();
  }
}
