import { Metadata, ResolvingMetadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import Dashboard from '@/app/(worldcups)/wc/[worldcup-id]/stats/components/Dashboard';
import Navbar from '@/app/components/navbar/navbar';
import { getCandidatesForStat } from '@/app/lib/candidate/service';
import { getSession } from '@/app/lib/session';
import { getWorldcup } from '@/app/lib/worldcup/service';

interface Props {
  params: { 'worldcup-id': string };
  searchParams: {
    page?: string;
  };
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const worldcupId = params['worldcup-id'];
  const worldcup = await getWorldcup(worldcupId);
  return {
    title: `${worldcup?.title} | 이상형 월드컵 NaePick`,
    description: worldcup?.description || '',
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
      <div className="flex h-svh flex-col">
        <Navbar />
        <Dashboard
          candidates={stat.data}
          statCount={stat.count}
          worldcup={worldcup}
          page={page}
          userId={session?.userId}
        />
      </div>
    );
  } else {
    notFound();
  }
}
