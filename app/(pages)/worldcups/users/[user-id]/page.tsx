import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import { fetchWorldcupsByUserId } from '@/app/lib/data/worldcups';
import { getSession } from '@/app/lib/actions/session';
import CardUpdateLink from '@/app/components/card-extensions/card-update-link';
import Card from '@/app/components/card/card';
import { redirect } from 'next/navigation';

interface Props {
  params: { ['user-id']: string };
}

export default async function Page({ params }: Props) {
  const userId = params['user-id'];
  const [allWorldcupsByUser, session] = await Promise.all([
    fetchWorldcupsByUserId(userId),
    getSession(),
  ]);
  dayjs.extend(relativeTime);
  dayjs.locale('ko');

  if (session?.userId !== userId) {
    redirect('/forbidden');
  }
  console.log(allWorldcupsByUser);

  return (
    <div className='max-w-screen-2xl m-auto'>
      <ul className='flex flex-wrap mt-6'>
        {allWorldcupsByUser &&
          allWorldcupsByUser.length > 0 &&
          allWorldcupsByUser.map((worldcup, index: number) => (
            <Card key={worldcup.worldcupId} worldcup={worldcup}>
              <CardUpdateLink
                worldcupId={worldcup.worldcupId}
                worldcupUserId={worldcup.userId}
              />
            </Card>
          ))}
      </ul>
    </div>
  );
}
