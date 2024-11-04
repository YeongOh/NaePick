import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import { getWorldcupsByUserId as getWorldcupCardsByUserId } from '@/app/lib/data/worldcups';
import { getSession } from '@/app/lib/actions/session';
import { notFound, redirect } from 'next/navigation';
import CardGrid from '@/app/components/card/card-grid';

interface Props {
  params: { ['user-id']: string };
}

export default async function Page({ params }: Props) {
  const userId = params['user-id'];
  const [result, session] = await Promise.all([
    getWorldcupCardsByUserId(null, userId),
    getSession(),
  ]);
  dayjs.extend(relativeTime);
  dayjs.locale('ko');

  if (session?.userId !== userId) {
    redirect('/forbidden');
  }
  if (!result) {
    notFound();
  }

  // TODO : no result?
  const { cursor, data } = result;

  return (
    <section className='max-w-screen-2xl m-auto'>
      {data ? (
        <CardGrid
          worldcupCards={data}
          cursor={cursor}
          getNextCardsFunc={getWorldcupCardsByUserId}
          nextCardsArgs={[userId]}
          extended
        />
      ) : null}
    </section>
  );
}
