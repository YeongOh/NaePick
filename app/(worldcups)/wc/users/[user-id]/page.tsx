import { getSession } from '@/app/lib/session';
import { notFound, redirect } from 'next/navigation';
import CardGridPagination from '@/app/components/card/card-grid-pagination';
import Navbar from '@/app/components/navbar/navbar';
import { getMyWorldcups } from '../../[worldcup-id]/actions';

interface Props {
  params: { 'user-id': string };
  searchParams: {
    page: string;
  };
}

export default async function Page({ params, searchParams }: Props) {
  const userId = params['user-id'];
  const page = Number(searchParams.page) || 1;
  const [result, session] = await Promise.all([getMyWorldcups(userId, page), getSession()]);

  if (session?.userId !== userId) {
    redirect('/forbidden');
  }
  if (!result) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <section className="max-w-screen-2xl m-auto">
        {result.data ? (
          <CardGridPagination
            count={result.count}
            page={page}
            worldcups={result.data as any}
            userId={userId}
            extended
          />
        ) : null}
      </section>
    </>
  );
}
