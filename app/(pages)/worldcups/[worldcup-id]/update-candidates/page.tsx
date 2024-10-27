import UpdateWorldcupCandidatesForm from '@/app/components/worldcups/update-worldcup-candidates-form';
import WorldcupFormTab from '@/app/components/worldcups/worldcup-form-tab';
import { getSession } from '@/app/lib/actions/session';
import { getCandidatesToUpdateByWorldcupId } from '@/app/lib/data/candidates';
import {
  getAllCategories,
  getWorldcupCardByWorldcupId,
} from '@/app/lib/data/worldcups';
import { notFound, redirect } from 'next/navigation';

interface Props {
  params: { 'worldcup-id': string };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const [worldcupResult, candidates, session, categories] = await Promise.all([
    getWorldcupCardByWorldcupId(worldcupId),
    getCandidatesToUpdateByWorldcupId(worldcupId),
    getSession(),
    getAllCategories(),
  ]);

  console.log(candidates);
  console.log(worldcupResult);

  if (!worldcupResult || !worldcupResult[0]) notFound();
  if (!candidates) notFound();
  if (worldcupResult[0].userId !== session.userId) redirect('/forbidden');

  console.log(worldcupResult[0]);
  return (
    <div className='max-w-3xl m-auto'>
      <WorldcupFormTab
        worldcupId={worldcupId}
        disabled={null}
        highlight='candidates'
      />
      <UpdateWorldcupCandidatesForm
        worldcup={worldcupResult[0]}
        candidates={candidates}
      />
    </div>
  );
}
