import { getSession } from '@/app/lib/session';
import { getWorldcupInfoFormByWorldcupId } from '@/app/lib/data/worldcups';
import { notFound, redirect } from 'next/navigation';
import Navbar from '@/app/components/navbar/navbar';
import EditWorldcupForm from './components/EditInfoForm';
import WorldcupFormTab from '../../components/WorldcupFormTab';
import { getAllCategories } from '@/app/lib/category/service';

interface Props {
  params: { 'worldcup-id': string };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const [worldcupResult, session, categories] = await Promise.all([
    getWorldcupInfoFormByWorldcupId(worldcupId),
    getSession(),
    getAllCategories(),
  ]);

  if (!worldcupResult || !worldcupResult[0] || !categories) notFound();
  if (worldcupResult[0].userId !== session.userId) redirect('/forbidden');

  return (
    <>
      <Navbar />
      <div className='max-w-xl m-auto flex flex-col'>
        <WorldcupFormTab
          worldcupId={worldcupId}
          disabled={null}
          highlight='info'
        />
        <EditWorldcupForm
          worldcup={worldcupResult[0]}
          categories={categories}
        />
      </div>
    </>
  );
}
