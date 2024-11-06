import { getWorldcupPickScreenByWorldcupId } from '@/app/lib/data/worldcups';
import StatisticsMain from '@/app/components/statistics/statistics-main';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/app/lib/actions/session';
import { getPaginationCandidateStatisticsByWorldcupId } from '@/app/lib/data/statistics';
import Navbar from '@/app/components/navbar/navbar';

interface Props {
  params: { 'worldcup-id': string; 'page-number': string };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const pageNumber = Number(params['page-number']) || 1;
  const [worldcupResult, candidatesStatistics, session] = await Promise.all([
    getWorldcupPickScreenByWorldcupId(worldcupId),
    getPaginationCandidateStatisticsByWorldcupId(worldcupId, pageNumber),
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
      <>
        <Navbar />
        <div>
          <StatisticsMain
            candidates={candidatesStatistics}
            worldcup={worldcup}
            pageNumber={pageNumber}
            userId={session?.userId}
          />
        </div>
      </>
    );
  } else {
    notFound();
  }
}
