import { getWorldcupPickScreenByWorldcupId } from '@/app/lib/data/worldcups';
import Dashboard from '@/app/(worldcups)/wc/[worldcup-id]/stats/components/Dashboard';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/app/lib/session';
import { getPaginationCandidateStatisticsByWorldcupId } from '@/app/lib/data/statistics';
import Navbar from '@/app/components/navbar/navbar';

interface Props {
  params: { 'worldcup-id': string };
  searchParams: {
    page?: string;
  };
}

export default async function Page({ params, searchParams }: Props) {
  const worldcupId = params['worldcup-id'];
  const pageNumber = Number(searchParams.page) || 1;
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
          <Dashboard
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
