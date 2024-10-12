import { getSession } from '../lib/actions/session';
import { fetchUserAllPosts } from '../lib/data';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import ThumbnailImage from '../ui/thumbnail/ThumbnailImage';
import CardForm from '../ui/cardLink/CardForm';

interface Props {
  params: { userId: string };
}

export default async function Page({ params }: Props) {
  const userId = params.userId;
  const [allUsersPosts, session] = await Promise.all([
    await fetchUserAllPosts(userId),
    await getSession(),
  ]);
  dayjs.extend(relativeTime);
  dayjs.locale('ko');

  if (session?.id !== userId) {
    return <div>권한 없음</div>;
  }
  return (
    <>
      <ul className='flex flex-wrap gap-4 m-4'>
        {allUsersPosts &&
          allUsersPosts.length > 0 &&
          allUsersPosts.map((post, index: number) => (
            <li key={post.id} className='p-4 group w-[340px] shadow-md'>
              <ThumbnailImage
                postId={post.id}
                leftCandidateUrl={post.leftCandidateUrl}
                leftCandidateName={post.leftCandidateName}
                rightCandidateUrl={post.rightCandidateUrl}
                rightCandidateName={post.rightCandidateName}
              />
              <div className='flex items-end justify-between'>
                <div className='flex-1'>
                  <h2 className='font-bold text-lg py-2' title={post.title}>
                    {post.title}
                  </h2>
                  <p className='mb-2'>{post.description}</p>
                  <div className='flex items-center justify-between w-full'>
                    <div>
                      <span className='text-gray-500'>{post.nickname}</span>
                      <span
                        className='text-gray-500 ml-4'
                        title={dayjs(post.createdAt).toString()}
                      >
                        {dayjs(post.createdAt).fromNow()}
                      </span>
                    </div>
                    <div className='cursor-pointer'>
                      <svg
                        fill='#000000'
                        width='32px'
                        height='32px'
                        viewBox='0 0 512 512'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <title>ionicons-v5-f</title>
                        <circle cx='256' cy='256' r='48' />
                        <circle cx='256' cy='416' r='48' />
                        <circle cx='256' cy='96' r='48' />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <CardForm postId={post.id} userId={userId} />
            </li>
          ))}
      </ul>
    </>
  );
}
