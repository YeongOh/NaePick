import { getWorldcupPickScreenByWorldcupId } from '@/app/lib/data/worldcups';
import StatisticsMain from '@/app/components/statistics/statistics-main';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/app/lib/actions/session';
import { getCandidateStatisticsByWorldcupIdAndPageNumber } from '@/app/lib/data/statistics';

interface Props {
  params: { 'worldcup-id': string; 'page-number': String };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const pageNumber = Number(params['page-number']) || 1;
  const [worldcupResult, candidatesStatistics, session] = await Promise.all([
    getWorldcupPickScreenByWorldcupId(worldcupId),
    getCandidateStatisticsByWorldcupIdAndPageNumber(worldcupId, pageNumber),
    getSession(),
  ]);

  if (worldcupResult && worldcupResult[0] && candidatesStatistics) {
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
          pageNumber={pageNumber}
        />
      </div>
    );
  } else {
    notFound();
  }
}
