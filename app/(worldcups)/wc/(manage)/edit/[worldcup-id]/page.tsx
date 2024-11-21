import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getCategories } from '@/app/lib/category/service';
import { getSession } from '@/app/lib/session';
import { getWorldcupForm } from '@/app/lib/worldcup/service';
import WorldcupForm from '../../components/WorldcupForm';
import WorldcupFormTab from '../../components/WorldcupFormTab';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const worldcupId = params['worldcup-id'];
  const worldcup = await getWorldcupForm(worldcupId);
  return {
    title: `${worldcup?.title} 정보 관리`,
    description: worldcup?.description || '',
  };
}

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
      <div className="m-auto flex max-w-2xl flex-col">
        <WorldcupFormTab worldcupId={worldcupId} disabled={null} highlight="info" />
        <WorldcupForm worldcup={worldcup} categories={categories} />
      </div>
    </>
  );
}
