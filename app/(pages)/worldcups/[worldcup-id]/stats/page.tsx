import { getWorldcupPickScreenByWorldcupId } from '@/app/lib/data/worldcups';
import StatisticsMain from '@/app/components/statistics/statistics-main';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/app/lib/actions/session';
import { getCommentsByWorldcupId } from '@/app/lib/data/comments';
import { getCandidateStatisticsByWorldcupIdAndPageNumber } from '@/app/lib/data/statistics';

interface Props {
  params: { ['worldcup-id']: string };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const [worldcupResult, candidatesStatistics, comments, session] =
    await Promise.all([
      getWorldcupPickScreenByWorldcupId(worldcupId),
      getCandidateStatisticsByWorldcupIdAndPageNumber(worldcupId, 1),
      getCommentsByWorldcupId(worldcupId),
      getSession(),
    ]);

  if (worldcupResult && worldcupResult[0] && candidatesStatistics && comments) {
    const worldcup = worldcupResult[0];
    if (
      worldcup.publicity === 'private' &&
      worldcup.userId !== session?.userId
    ) {
      redirect('/forbidden');
    }

    // TODO: 챔피언 4개 미만인지 확인

    return (
      <div>
        <StatisticsMain
          candidates={candidatesStatistics}
          worldcup={worldcup}
          comments={comments}
        />
      </div>
    );
  } else {
    notFound();
  }
}
