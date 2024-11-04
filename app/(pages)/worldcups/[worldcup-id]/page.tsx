import { getSession } from '@/app/lib/actions/session';
import { getWorldcupPickScreenByWorldcupId } from '@/app/lib/data/worldcups';
import { notFound, redirect } from 'next/navigation';
import WorldcupPickScreenSetter from '@/app/components/worldcups/worldcup-pick-screen-setter';
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
      <WorldcupPickScreenSetter worldcup={worldcupResult[0]} />
    </>
  );
}
