import { getSession } from '@/app/lib/session';
import { getWorldcupInfoFormByWorldcupId } from '@/app/lib/data/worldcups';
import { notFound, redirect } from 'next/navigation';
import Navbar from '@/app/components/navbar/navbar';
import WorldcupFormTab from '../../components/WorldcupFormTab';
import { getAllCategories } from '@/app/lib/category/service';
import WorldcupForm from '../../components/WorldcupForm';
import { getWorldcupForm } from '@/app/lib/worldcups/service';

interface Props {
  params: { 'worldcup-id': string };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const [worldcups, session, categories] = await Promise.all([
    getWorldcupForm(worldcupId),
    getSession(),
    getAllCategories(),
  ]);

  if (!worldcups || !worldcups[0] || !categories) notFound();
  if (worldcups[0].userId !== session.userId) redirect('/forbidden');

  return (
    <>
      <Navbar />
      <div className="max-w-xl m-auto flex flex-col">
        <WorldcupFormTab worldcupId={worldcupId} disabled={null} highlight="info" />
        <WorldcupForm worldcup={worldcups[0]} categories={categories} />
      </div>
    </>
  );
}
