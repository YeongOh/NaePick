import { fetchPublicPostCards } from './lib/data';
import 'dayjs/locale/ko';
import Card from './ui/card/Card';

export default async function Home() {
  const allPublicPostCards = await fetchPublicPostCards();

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
