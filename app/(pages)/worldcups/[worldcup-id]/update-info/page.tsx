import { getSession } from '@/app/lib/actions/session';
import {
  fetchAllCategories,
  fetchWorldcupInfoFormByWorldcupId,
} from '@/app/lib/data/worldcups';
import UpdateWorldcupInfoForm from '@/app/components/worldcups/update-worldcup-info-form';
import { notFound, redirect } from 'next/navigation';
import WorldcupFormTab from '@/app/components/worldcups/worldcup-form-tab';

interface Props {
  params: { 'worldcup-id': string };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const [worldcupResult, session, categories] = await Promise.all([
    fetchWorldcupInfoFormByWorldcupId(worldcupId),
    getSession(),
    fetchAllCategories(),
  ]);

  if (!worldcupResult || !worldcupResult[0] || !categories) notFound();
  if (worldcupResult[0].userId !== session.userId) redirect('/forbidden');

  return (
    <div className='max-w-3xl m-auto'>
      <WorldcupFormTab
        worldcupId={worldcupId}
        disabled={null}
        highlight='info'
      />
      <UpdateWorldcupInfoForm
        worldcup={worldcupResult[0]}
        categories={categories}
      />
    </div>
  );
}
