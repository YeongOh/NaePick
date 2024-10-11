import { Post, translateCategory } from '@/app/lib/definitions';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

interface Props {
  postStat: Post;
}

export default function Fold({ postStat }: Props) {
  const {
    title,
    publicity,
    nickname,
    createdAt,
    updatedAt,
    description,
    categoryName,
  } = postStat!;

  dayjs.extend(relativeTime);
  dayjs.locale('ko');

  const createdDate = dayjs(createdAt);
  const updatedDate = dayjs(updatedAt);
  const isUpdated = createdDate.diff(updatedDate);

  return (
    <>
      <section className='p-4'>
        <div className='flex gap-4 mb-1'>
          <h2 className='font-bold text-xl'>{title}</h2>
          <p className='bg-gray-400 rounded-xl text-white px-2'>
            {translatePublicity(publicity)}
          </p>
        </div>
        <div className='flex gap-4 mb-2'>
          <p className='text-gray-500'>{nickname}</p>
          <p>
            <span title={dayjs(createdAt).toString()} className='mr-2'>
              {createdDate.fromNow()}
            </span>
            {isUpdated ? (
              <span className='text-gray-500'>
                (업데이트: {dayjs(updatedAt).fromNow()})
              </span>
            ) : null}
          </p>
        </div>
        <p>{description}</p>
        <p>{translateCategory(categoryName)}</p>
      </section>
    </>
  );
}

function translatePublicity(text: string) {
  switch (text) {
    case 'public':
      return '공개';
    case 'unlisted':
      return '미등록';
    default:
      return '비공개';
  }
}
