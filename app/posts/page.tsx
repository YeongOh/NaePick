import Link from 'next/link';
import { fetchAllPosts } from '../lib/data';
import Image from 'next/image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

export default async function Page() {
  const allPosts: any = await fetchAllPosts();
  dayjs.extend(relativeTime);
  dayjs.locale('ko');

  return (
    <>
      <ul className='grid grid-cols-3 cursor-pointer  '>
        {allPosts &&
          allPosts.length > 0 &&
          allPosts.map((post: any, index: number) => (
            <li key={post.id} className='p-4 group'>
              <Link href={`/posts/${post.id}`} className='inline-flex bg-black'>
                <Image
                  src={post.leftCandidateUrl}
                  alt='placeholder'
                  width={0}
                  height={0}
                  sizes='100vw'
                  className='w-full object-cover'
                  title='placeholder'
                />
                <Image
                  src={post.rightCandidateUrl}
                  alt='placeholder'
                  width={0}
                  height={0}
                  sizes='100vw'
                  className='w-full object-cover'
                  title='placeholder'
                />
                <div className='absolute bottom-0 left-0 text-white text-sm truncate'>
                  {post.leftCandidateName}
                </div>
                <div className='absolute bottom-0 right-0 text-white text-sm truncate'>
                  {post.rightCandidateName}
                </div>
              </Link>
              <Link href={`/posts/${post.id}`}>
                <h2 className='font-bold text-lg py-2' title={post.title}>
                  {post.title}
                </h2>
                <p>{post.description}</p>
                <div className='flex items-center justify-between'>
                  <div>
                    <span className='text-gray-500'>{post.userId}</span>
                    <span
                      className='text-gray-500 ml-4'
                      title={dayjs(post.createdAt).toString()}
                    >
                      {dayjs(post.createdAt).fromNow()}
                    </span>
                  </div>
                  <div>
                    <button title='공유하기'>공유</button>
                    <button className='ml-2' title='즐겨찾기'>
                      즐찾
                    </button>
                  </div>
                </div>
              </Link>
            </li>
          ))}
      </ul>
    </>
  );
}
