import Main from '@/app/components/main';
import Navbar from '@/app/components/navbar/navbar';
import {
  getInfiniteLatestWorldcupCards,
  getInfinitePopularWorldcupCards,
} from '@/app/lib/data/worldcups';
import 'dayjs/locale/ko';
import { notFound } from 'next/navigation';

interface Props {
  params: { 'worldcup-filter': string };
}

export default async function Page({ params }: Props) {
  const filter = params['worldcup-filter'];
  if (filter === 'popular') {
    const result = await getInfinitePopularWorldcupCards(null);

    if (!result) {
      notFound();
    }

    const { cursor, data } = result;

    return (
      <>
        <Navbar />
        <Main initialWorldcupCards={data} params='popular' cursor={cursor} />
      </>
    );
  }
  if (filter === 'latest') {
    const result = await getInfiniteLatestWorldcupCards(null);

    if (!result) {
      notFound();
    }

    const { cursor, data } = result;

    return (
      <>
        <Navbar />
        <Main initialWorldcupCards={data} params='latest' cursor={cursor} />
      </>
    );
  }
}
