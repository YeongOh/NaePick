import { getPublicWorldcupCards } from './lib/data/worldcups';
import 'dayjs/locale/ko';
import CardGrid from './components/card/card-grid';
import Navbar from './components/navbar/navbar';

export default async function Home() {
  const { data, hasNextPage }: any = await getPublicWorldcupCards(1);
  console.log(data, hasNextPage);

  return (
    <>
      <Navbar />
      <section className='max-w-screen-2xl m-auto'>
        {data ? (
          <CardGrid worldcupCards={data} hasNextPageProp={hasNextPage} />
        ) : null}
        {/* 로딩 스피너 혹은 해당하는 월드컵이 없습니다 UI표시 */}
      </section>
    </>
  );
}
