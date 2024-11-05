import Main from '@/app/components/main/main';
import Navbar from '@/app/components/navbar/navbar';
import { getInfinitePopularWorldcupCardsByCategory } from '@/app/lib/data/worldcups';
import 'dayjs/locale/ko';
import { notFound } from 'next/navigation';

interface Props {
  params: { 'category-name': string };
}

export default async function Page({ params }: Props) {
  const categoryName = params['category-name'];
  const result = await getInfinitePopularWorldcupCardsByCategory(
    null,
    categoryName
  );

  if (!result) {
    notFound();
  }

  const { cursor, data } = result;

  return (
    <>
      <Navbar />
      <Main
        initialWorldcupCards={data}
        params='popularCategory'
        cursor={cursor}
        funcArgs={categoryName}
      />
    </>
  );
}
