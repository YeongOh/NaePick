import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import { getWorldcupsByUserId as getWorldcupCardsByUserId } from '@/app/lib/data/worldcups';
import { getSession } from '@/app/lib/actions/session';
import CardUpdateLink from '@/app/components/card-extensions/card-update-link';
import Card from '@/app/components/card/card';
import { redirect } from 'next/navigation';

interface Props {
  params: { ['user-id']: string };
}

export default async function Page({ params }: Props) {
  const userId = params['user-id'];
  const [allWorldcupCardsByUser, session] = await Promise.all([
    getWorldcupCardsByUserId(userId),
    getSession(),
  ]);
  dayjs.extend(relativeTime);
  dayjs.locale('ko');

  if (session?.userId !== userId) {
    redirect('/forbidden');
  }
  console.log(allWorldcupCardsByUser);

  return (
    <div className='max-w-screen-2xl m-auto'>
      <ul className='flex flex-wrap mt-6'>
        {allWorldcupCardsByUser &&
          allWorldcupCardsByUser.length > 0 &&
          allWorldcupCardsByUser.map((worldcup, index: number) => (
            <Card key={worldcup.worldcupId} worldcupCard={worldcup}>
              <CardUpdateLink worldcupId={worldcup.worldcupId} />
            </Card>
          ))}
      </ul>
    </div>
  );
}
