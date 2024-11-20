import { notFound, redirect } from 'next/navigation';
import Navbar from '@/app/components/oldNavbar/navbar';
import { getSession } from '@/app/lib/session';
import LinkButton from '@/app/ui/LinkButton';
import { getMyWorldcupFavourites } from './actions';
import FavouriteContent from './components/FavouriteContent';

interface Props {
  searchParams: {
    page: string;
  };
}

export default async function Page({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const [result, session] = await Promise.all([getMyWorldcupFavourites(page), getSession()]);

  if (!session?.userId) {
    redirect('/forbidden');
  }
  if (!result) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <section className="m-auto max-w-screen-2xl">
        {result.data.length ? (
          <FavouriteContent count={result.count} page={page} worldcups={result.data as any} />
        ) : (
          <div className="mx-auto flex max-w-screen-sm flex-col items-center justify-center text-center">
            <p className="mb-4 mt-10 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              아직 즐겨찾기한 이상형 월드컵이 없습니다.
            </p>
            <div className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">둘러보세요!</div>
            <div className="flex w-36 flex-col items-center justify-center">
              <LinkButton href="/" variant="primary" size="md" className="my-2">
                둘러보기
              </LinkButton>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
