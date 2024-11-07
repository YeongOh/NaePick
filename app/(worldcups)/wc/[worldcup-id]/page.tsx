import { getSession } from '@/app/lib/session';
import { getWorldcupPickScreenByWorldcupId } from '@/app/lib/data/worldcups';
import { notFound, redirect } from 'next/navigation';
import WorldcupStarter from '@/app/(worldcups)/wc/[worldcup-id]/components/WorldcupStarter';
import Navbar from '@/app/components/navbar/navbar';

interface Props {
  params: { ['worldcup-id']: string };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const [worldcupResult, session] = await Promise.all([
    getWorldcupPickScreenByWorldcupId(worldcupId),
    getSession(),
  ]);

  if (!worldcupResult || !worldcupResult[0]) {
    notFound();
  }

  if (
    worldcupResult[0].publicity === 'private' &&
    session.userId !== worldcupResult[0].userId
  ) {
    redirect('/forbidden');
  }

  return (
    <>
      <Navbar screenMode />
      <WorldcupStarter worldcup={worldcupResult[0]} userId={session?.userId} />
    </>
  );
}
