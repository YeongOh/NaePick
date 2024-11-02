import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import ToggleableP from '../ui/toggleable-p';

interface Props {
  nickname: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  children: React.ReactNode;
}

export default function Fold({
  nickname,
  createdAt,
  updatedAt,
  description,
  children,
}: Props) {
  const createdDate = dayjs(createdAt);
  const updatedDate = dayjs(updatedAt);
  const isUpdated = createdDate.diff(updatedDate);

  return (
    <>
      <div className='flex mb-4 gap-1'>{children}</div>
      <div className='text-md text-slate-700 font-semibold mb-1'>
        {nickname}
      </div>
      <div className='text-sm text-gray-500 mb-2'>
        {createdDate.format('YYYY년 MM월 MM일')}{' '}
        <span title={updatedDate.format('YYYY년 MM월 MM일')}>
          (
          {isUpdated
            ? `${updatedDate.fromNow()} 업데이트`
            : `${updatedDate.fromNow()} 업데이트`}
          )
        </span>
      </div>
      <div className='mb-5'>
        <ToggleableP
          className='text-slate-700 w-full'
          numberOfLines={6}
          text={description}
        />
      </div>
    </>
  );
}
