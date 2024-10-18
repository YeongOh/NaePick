import { fetchPublicWorldcupCards } from './lib/data';
import 'dayjs/locale/ko';
import Card from './components/card/card';

export default async function Home() {
  const allPublicPostCards = await fetchPublicWorldcupCards();

  return (
    <div className='max-w-screen-2xl m-auto'>
      <ul className='flex flex-wrap mt-6'>
        {allPublicPostCards &&
          allPublicPostCards.length > 0 &&
          allPublicPostCards.map((post, index: number) => (
            <Card key={post.id} post={post} />
          ))}
      </ul>
    </div>
  );
}
