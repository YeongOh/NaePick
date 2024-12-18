import { Metadata, ResolvingMetadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import WorldcupStarter from '@/app/(worldcups)/wc/[worldcup-id]/components/WorldcupStarter';
import Navbar from '@/app/components/Navbar/Navbar';
import { getSession } from '@/app/lib/session';
import { getWorldcup } from '@/app/lib/worldcup/service';
import { SavedWorldcupMatchProvider } from './hooks/useSavedWorldcupMatch';
import { WorldcupMatchProvider } from './hooks/useWorldcupMatch';

interface Props {
  params: { ['worldcup-id']: string };
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const worldcupId = params['worldcup-id'];
  const worldcup = await getWorldcup(worldcupId);
  return {
    title: worldcup?.title,
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
        <SavedWorldcupMatchProvider worldcupId={worldcup.id}>
          <WorldcupStarter />
        </SavedWorldcupMatchProvider>
      </WorldcupMatchProvider>
    </div>
  );
}
