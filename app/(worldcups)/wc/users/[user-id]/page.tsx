import {
  getPaginationWorldcupsByUserId,
  getWorldcupPageCountByUserId,
} from '@/app/lib/data/worldcups';
import { getSession } from '@/app/lib/session';
import { notFound, redirect } from 'next/navigation';
import CardGridPagination from '@/app/components/card/card-grid-pagination';
import Navbar from '@/app/components/navbar/navbar';

interface Props {
  params: { 'user-id': string };
  searchParams: {
    page: string;
  };
}

export default async function Page({ params, searchParams }: Props) {
  const userId = params['user-id'];
  const pageNumber = Number(searchParams.page) || 1;
  const [worldcupCards, totalPages, session] = await Promise.all([
    getPaginationWorldcupsByUserId(pageNumber, userId),
    getWorldcupPageCountByUserId(userId),
    getSession(),
  ]);

  if (session?.userId !== userId) {
    redirect('/forbidden');
  }
  if (!worldcupCards) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <section className='max-w-screen-2xl m-auto'>
        {worldcupCards.length ? (
          <CardGridPagination
            totalPages={totalPages}
            pageNumber={pageNumber}
            worldcupCards={worldcupCards}
            userId={userId}
            extended
          />
        ) : null}
      </section>
    </>
  );
}
