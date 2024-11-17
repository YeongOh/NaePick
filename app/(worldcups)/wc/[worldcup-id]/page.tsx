import { getSession } from '@/app/lib/session';
import { notFound, redirect } from 'next/navigation';
import WorldcupStarter from '@/app/(worldcups)/wc/[worldcup-id]/components/WorldcupStarter';
import Navbar from '@/app/components/navbar/navbar';
import { getWorldcup } from '@/app/lib/worldcup/service';
import { Metadata, ResolvingMetadata } from 'next';
import { WorldcupMatchProvider } from './hooks/useWorldcupMatch';

interface Props {
  params: { ['worldcup-id']: string };
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const worldcupId = params['worldcup-id'];
  const worldcup = await getWorldcup(worldcupId);
  return {
    title: `${worldcup?.title} | 이상형 월드컵 NaePick`,
    description: worldcup?.description || '',
  };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const [worldcup, session] = await Promise.all([getWorldcup(worldcupId), getSession()]);

  if (!worldcup) {
    notFound();
  }

  if (worldcup.publicity === 'private' && session?.userId !== worldcup.userId) {
    redirect('/forbidden');
  }

  return (
    <div className="flex h-svh flex-col items-stretch bg-black/50">
      <Navbar screenMode />
      <WorldcupMatchProvider worldcup={worldcup} userId={session?.userId}>
        <WorldcupStarter />
      </WorldcupMatchProvider>
    </div>
  );
}
