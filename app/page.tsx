import dayjs from 'dayjs';
import { fetchPublicPosts } from './lib/data';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import ThumbnailImage from './ui/thumbnail/ThumbnailImage';
import CardLink from './ui/cardLink/CardLink';
import { getNumberOfRoundsAvailable } from './constants';

export default async function Home() {
  const allPosts = await fetchPublicPosts();
  dayjs.extend(relativeTime);
  dayjs.locale('ko');

  return (
    <>
      <ul className='flex flex-wrap gap-4 m-4'>
        {allPosts &&
          allPosts.length > 0 &&
          allPosts.map((post, index: number) => (
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
              <CardLink
                postId={post.id}
                availableRounds={getNumberOfRoundsAvailable(
                  post.numberOfCandidates
                )}
                title={post.title}
              />
            </li>
          ))}
      </ul>
    </>
  );
}
