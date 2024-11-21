import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import WorldcupFormTab from '@/app/(worldcups)/wc/(manage)/components/WorldcupFormTab';
import { getCandidatesForUpdate } from '@/app/lib/candidate/service';
import { getSession } from '@/app/lib/session';
import { verifyWorldcupOwner } from '@/app/lib/worldcup/auth';
import { getWorldcup } from '@/app/lib/worldcup/service';
import EditCandidatesForm from './components/EditCandidatesForm';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const worldcupId = params['worldcup-id'];
  const worldcup = await getWorldcup(worldcupId);
  return {
    title: `${worldcup?.title} 후보 관리`,
    description: worldcup?.description || '',
  };
}

interface Props {
  params: { 'worldcup-id': string };
  searchParams: {
    page?: string;
  };
}

export default async function Page({ params, searchParams }: Props) {
  const worldcupId = params['worldcup-id'];
  const page = Number(searchParams.page) || 1;
  const [result, session] = await Promise.all([getCandidatesForUpdate(worldcupId, page), getSession()]);

  if (!result) notFound();
  if (!session) redirect('/forbidden');
  if (!(await verifyWorldcupOwner(worldcupId, session.userId))) redirect('/forbidden');

  return (
    <>
      <div className="m-auto max-w-2xl">
        <WorldcupFormTab worldcupId={worldcupId} disabled={null} highlight="candidates" />
        <EditCandidatesForm
          worldcupId={worldcupId}
          candidates={result.data}
          count={result.count}
          page={page}
        />
      </div>
    </>
  );
}
