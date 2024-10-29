import { getPublicWorldcupCards } from './lib/data/worldcups';
import 'dayjs/locale/ko';
import CardGrid from './components/card-grid/card-grid';
import Navbar from './components/navbar/navbar';

export default async function Home() {
  const allPublicWorldcupCards = await getPublicWorldcupCards();

  return (
    <>
      <Navbar />
      <section className='max-w-screen-2xl m-auto'>
        {allPublicWorldcupCards ? (
          <CardGrid worldcupCards={allPublicWorldcupCards} />
        ) : null}
        {/* 로딩 스피너 혹은 해당하는 월드컵이 없습니다 UI표시 */}
      </section>
    </>
  );
}
