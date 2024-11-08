import Navbar from '@/app/components/navbar/navbar';
import WorldcupFormTab from '@/app/(worldcups)/wc/(manage)/components/WorldcupFormTab';
import { getSession } from '@/app/lib/session';
import { notFound, redirect } from 'next/navigation';
import EditCandidatesForm from './components/EditCandidatesForm';
import { getCandidatesForUpdate } from '@/app/lib/candidates/service';
import { verifyWorldcupOwner } from '@/app/lib/worldcups/auth';

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
  if (!(await verifyWorldcupOwner(worldcupId, session.userId))) redirect('/forbidden');

  return (
    <>
      <Navbar />
      <div className="max-w-3xl m-auto">
        <WorldcupFormTab worldcupId={worldcupId} disabled={null} highlight="candidates" />
        <EditCandidatesForm
          worldcupId={worldcupId}
          candidates={result.candidates}
          count={result.count}
          page={page}
        />
      </div>
    </>
  );
}
