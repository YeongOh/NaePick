import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import { fetchUserAllPosts } from '@/app/lib/data';
import { getSession } from '@/app/lib/actions/session';
import CardUpdateForm from '@/app/ui/cardLink/CardUpdateForm';
import Card from '@/app/ui/card/Card';
import { redirect } from 'next/navigation';

interface Props {
  params: { userId: string };
}

export default async function Page({ params }: Props) {
  const userId = params.userId;
  const [allUsersPosts, session] = await Promise.all([
    fetchUserAllPosts(userId),
    getSession(),
  ]);
  dayjs.extend(relativeTime);
  dayjs.locale('ko');

  if (session?.id !== userId) {
    redirect('/error/forbidden');
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
