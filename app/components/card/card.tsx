import { PostCard } from '@/app/lib/definitions';
import ThumbnailImage from '../thumbnail/ThumbnailImage';
import CardLink from '../card-extensions/card-link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

interface Props {
  post: PostCard;
  children?: React.ReactNode;
}

export default function Card({ post, children }: Props) {
  dayjs.extend(relativeTime);
  dayjs.locale('ko');

  return (
    <li className='p-4 w-[300px] mb-4'>
      <div className='h-[230px]'>
        <ThumbnailImage
          postId={post.id}
          leftCandidateUrl={post.leftCandidateUrl}
          leftCandidateName={post.leftCandidateName}
          rightCandidateUrl={post.rightCandidateUrl}
          rightCandidateName={post.rightCandidateName}
        />
        <div className='flex items-end justify-between'>
          <div className='flex-1 overflow-hidden'>
            <h2
              className='text-lg font-bold line-clamp-2 mb-2 text-slate-700'
              title={post.title}
            >
              {post.title}
            </h2>
            <div className='flex items-center justify-between w-full'>
              <div className='text-base text-gray-500'>
                <span>{post.nickname}</span>
                <span className='ml-2' title={dayjs(post.createdAt).toString()}>
                  {dayjs(post.createdAt).fromNow()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CardLink
        postId={post.id}
        numberOfCandidates={post.numberOfCandidates}
        title={post.title}
      />
      {children}
    </li>
  );
}
