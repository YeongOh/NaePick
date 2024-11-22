import { redirect } from 'next/navigation';
import Navbar from '@/app/components/Navbar/Navbar';
import { getSession } from '@/app/lib/session';
import FavouriteContent from './components/FavouriteContent';

export const metadata = {
  title: '즐겨찾기',
};

interface Props {
  searchParams: {
    page: string;
  };
}

export default async function Page({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const session = await getSession();

  if (!session?.userId) {
    redirect('/forbidden');
  }

  return (
    <>
      <Navbar />
      <section className="m-auto max-w-screen-2xl">
        <FavouriteContent page={page} />
      </section>
    </>
  );
}
