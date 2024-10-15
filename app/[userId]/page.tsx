import { getSession } from '../lib/actions/session';
import { fetchUserAllPosts } from '../lib/data';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import ThumbnailImage from '../ui/thumbnail/ThumbnailImage';
import CardUpdateForm from '../ui/cardLink/CardUpdateForm';
import { getNumberOfRoundsAvailable } from '../constants';
import CardLink from '../ui/cardLink/CardLink';

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
                    <div className='cursor-pointer'></div>
                  </div>
                </div>
              </div>
              <CardLink
                postId={post.id}
                availableRounds={getNumberOfRoundsAvailable(
                  post.numberOfCandidates
                )}
                title={post.title}
              />
              <CardUpdateForm postId={post.id} userId={userId} />
            </li>
          ))}
      </ul>
    </>
  );
}
