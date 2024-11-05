import Navbar from '@/app/components/navbar/navbar';
import UpdateWorldcupCandidatesForm from '@/app/components/worldcups/update-worldcup-candidates-form';
import WorldcupFormTab from '@/app/components/worldcups/worldcup-form-tab';
import { getSession } from '@/app/lib/actions/session';
import { getCandidatesToUpdateByWorldcupId } from '@/app/lib/data/candidates';
import { getWorldcupCardByWorldcupId } from '@/app/lib/data/worldcups';
import { notFound, redirect } from 'next/navigation';

interface Props {
  params: { 'worldcup-id': string; 'page-number': String };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const pageNumber = Number(params['page-number']) || 1;
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
        <UpdateWorldcupCandidatesForm
          worldcup={worldcupResult[0]}
          candidates={candidates}
          pageNumber={pageNumber}
        />
      </div>
    </>
  );
}
