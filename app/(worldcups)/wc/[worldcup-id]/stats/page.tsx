import Dashboard from '@/app/(worldcups)/wc/[worldcup-id]/stats/components/Dashboard';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/app/lib/session';
import { getPaginationCandidateStatisticsByWorldcupId } from '@/app/lib/data/statistics';
import Navbar from '@/app/components/navbar/navbar';
import { getWorldcup } from '@/app/lib/worldcup/service';
import { getCandidatesForStat } from '@/app/lib/candidate/service';

interface Props {
  params: { 'worldcup-id': string };
  searchParams: {
    page?: string;
  };
}

export default async function Page({ params, searchParams }: Props) {
  const worldcupId = params['worldcup-id'];
  const page = Number(searchParams.page) || 1;
  const [worldcup, stat, session] = await Promise.all([
    getWorldcup(worldcupId),
    getCandidatesForStat(worldcupId, page),
    getSession(),
  ]);

  if (worldcup && stat) {
    if (worldcup.publicity === 'private' && worldcup.userId !== session?.userId) {
      redirect('/forbidden');
    }

    return (
      <>
        <Navbar />
        <div>
          <Dashboard
            candidates={stat.data}
            statCount={stat.count}
            worldcup={worldcup}
            page={page}
            userId={session?.userId}
          />
        </div>
      </>
    );
  } else {
    notFound();
  }
}
