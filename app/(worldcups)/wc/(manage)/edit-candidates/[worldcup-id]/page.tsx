import Navbar from '@/app/components/navbar/navbar';
import WorldcupFormTab from '@/app/(worldcups)/wc/(manage)/components/WorldcupFormTab';
import { getSession } from '@/app/lib/session';
import { getCandidatesToUpdateByWorldcupId } from '@/app/lib/data/candidates';
import { getWorldcupCardByWorldcupId } from '@/app/lib/data/worldcups';
import { notFound, redirect } from 'next/navigation';
import EditCandidatesForm from './components/EditCandidatesForm';

interface Props {
  params: { 'worldcup-id': string };
  searchParams: {
    page?: string;
  };
}

export default async function Page({ params, searchParams }: Props) {
  const worldcupId = params['worldcup-id'];
  const pageNumber = Number(searchParams.page) || 1;
  const [worldcupResult, candidates, session] = await Promise.all([
    getWorldcupCardByWorldcupId(worldcupId),
    getCandidatesToUpdateByWorldcupId(worldcupId, pageNumber),
    getSession(),
  ]);

  if (!worldcupResult || !worldcupResult[0]) notFound();
  if (!candidates) notFound();
  if (worldcupResult[0].userId !== session.userId) redirect('/forbidden');

  return (
    <>
      <Navbar />
      <div className='max-w-3xl m-auto'>
        <WorldcupFormTab
          worldcupId={worldcupId}
          disabled={null}
          highlight='candidates'
        />
        <EditCandidatesForm
          worldcup={worldcupResult[0]}
          candidates={candidates}
          pageNumber={pageNumber}
        />
      </div>
    </>
  );
}
