import UpdateWorldcupCandidatesForm from '@/app/components/worldcups/update-worldcup-candidates-form';
import WorldcupFormTab from '@/app/components/worldcups/worldcup-form-tab';
import { getSession } from '@/app/lib/actions/session';
import { fetchCandidatesToUpdateByWorldcupId } from '@/app/lib/data/candidates';
import {
  fetchAllCategories,
  fetchWorldcupInfoFormByWorldcupId,
} from '@/app/lib/data/worldcups';
import { notFound, redirect } from 'next/navigation';

interface Props {
  params: { 'worldcup-id': string };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const [worldcupResult, candidates, session, categories] = await Promise.all([
    fetchWorldcupInfoFormByWorldcupId(worldcupId),
    fetchCandidatesToUpdateByWorldcupId(worldcupId),
    getSession(),
    fetchAllCategories(),
  ]);

  console.log(candidates);

  if (!worldcupResult || !worldcupResult[0]) notFound();
  if (!candidates) notFound();
  if (worldcupResult[0].userId !== session.userId) redirect('/forbidden');

  return (
    <div className='max-w-3xl m-auto'>
      <WorldcupFormTab worldcupId={worldcupId} disabled={null} />
      <UpdateWorldcupCandidatesForm
        worldcup={worldcupResult[0]}
        candidates={candidates}
      />
    </div>
  );
}
