import { getInfinitePopularWorldcupCards } from './lib/data/worldcups';
import 'dayjs/locale/ko';
import Navbar from './components/navbar/navbar';
import { notFound } from 'next/navigation';
import Main from './components/main';

export default async function Home() {
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
