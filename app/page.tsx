import { getPublicWorldcupCards } from './lib/data/worldcups';
import 'dayjs/locale/ko';
import Card from './components/card/card';

export default async function Home() {
  const allPublicWorldcupCards = await getPublicWorldcupCards();

  return (
    <div className='max-w-screen-2xl m-auto'>
      <ul className='flex flex-wrap mt-6'>
        {allPublicWorldcupCards &&
          allPublicWorldcupCards.length > 0 &&
          allPublicWorldcupCards.map((worldcup, index: number) => (
            <Card key={worldcup.worldcupId} worldcupCard={worldcup} />
          ))}
      </ul>
    </div>
  );
}
