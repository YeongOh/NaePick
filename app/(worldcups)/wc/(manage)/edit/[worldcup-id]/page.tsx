import { getSession } from '@/app/lib/session';
import { notFound, redirect } from 'next/navigation';
import Navbar from '@/app/components/navbar/navbar';
import WorldcupFormTab from '../../components/WorldcupFormTab';
import { getCategories } from '@/app/lib/category/service';
import WorldcupForm from '../../components/WorldcupForm';
import { getWorldcupForm } from '@/app/lib/worldcup/service';

interface Props {
  params: { 'worldcup-id': string };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const [worldcup, session, categories] = await Promise.all([
    getWorldcupForm(worldcupId),
    getSession(),
    getCategories(),
  ]);

  if (!worldcup || !categories) notFound();
  if (worldcup.userId !== session?.userId) redirect('/forbidden');

  return (
    <>
      <Navbar />
      <div className="m-auto flex max-w-xl flex-col">
        <WorldcupFormTab worldcupId={worldcupId} disabled={null} highlight="info" />
        <WorldcupForm worldcup={worldcup} categories={categories} />
      </div>
    </>
  );
}
