import { getPublicWorldcupCards } from './lib/data/worldcups';
import 'dayjs/locale/ko';
import CardGrid from './components/card/card-grid';
import Navbar from './components/navbar/navbar';
import { notFound } from 'next/navigation';

export default async function Home() {
  const result = await getPublicWorldcupCards(null);

  if (!result) {
    notFound();
  }

  const { cursor, data } = result;

  return (
    <>
      <Navbar />
      <section className='max-w-screen-2xl m-auto'>
        {data ? (
          <CardGrid
            worldcupCards={data}
            cursor={cursor}
            getNextCardsFunc={getPublicWorldcupCards}
          />
        ) : null}
      </section>
    </>
  );
}
