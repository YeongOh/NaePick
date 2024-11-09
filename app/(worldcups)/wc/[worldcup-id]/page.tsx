import { getSession } from '@/app/lib/session';
import { getWorldcupPickScreenByWorldcupId } from '@/app/lib/data/worldcups';
import { notFound, redirect } from 'next/navigation';
import WorldcupStarter from '@/app/(worldcups)/wc/[worldcup-id]/components/WorldcupStarter';
import Navbar from '@/app/components/navbar/navbar';
import { getWorldcup } from '@/app/lib/worldcup/service';

interface Props {
  params: { ['worldcup-id']: string };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const [worldcup, session] = await Promise.all([getWorldcup(worldcupId), getSession()]);

  if (!worldcup) {
    notFound();
  }

  if (worldcup.publicity === 'private' && session.userId !== worldcup.userId) {
    redirect('/forbidden');
  }

  return (
    <>
      <Navbar screenMode />
      <WorldcupStarter worldcup={worldcup} userId={session?.userId} />
    </>
  );
}
