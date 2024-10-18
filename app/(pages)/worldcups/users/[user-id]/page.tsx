import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import { fetchWorldcupsByUserId } from '@/app/lib/data';
import { getSession } from '@/app/lib/actions/session';
import CardUpdateForm from '@/app/components/card-extensions/card-update-form';
import Card from '@/app/components/card/card';
import { redirect } from 'next/navigation';

interface Props {
  params: { ['user-id']: string };
}

export default async function Page({ params }: Props) {
  const userId = params['user-id'];
  const [allUsersPosts, session] = await Promise.all([
    fetchWorldcupsByUserId(userId),
    getSession(),
  ]);
  dayjs.extend(relativeTime);
  dayjs.locale('ko');

  if (session?.id !== userId) {
    redirect('/forbidden');
  }
  return (
    <div className='max-w-screen-2xl m-auto'>
      <ul className='flex flex-wrap mt-6'>
        {allUsersPosts &&
          allUsersPosts.length > 0 &&
          allUsersPosts.map((post, index: number) => (
            <Card key={post.id} post={post}>
              <CardUpdateForm postId={post.id} userId={userId} />
            </Card>
          ))}
      </ul>
    </div>
  );
}