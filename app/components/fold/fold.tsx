import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import ToggleableP from '../ui/toggleable-p';
import ProfileImage from '../ui/profile-image';

interface Props {
  nickname: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  children: React.ReactNode;
  profilePathname: string;
}

export default function Fold({
  nickname,
  createdAt,
  updatedAt,
  description,
  children,
  profilePathname,
}: Props) {
  const createdDate = dayjs(createdAt);
  const updatedDate = dayjs(updatedAt);
  const isUpdated = createdDate.diff(updatedDate);

  return (
    <>
      <div className='flex mb-4 gap-1'>{children}</div>
      <div className='flex items-center mb-1'>
        <ProfileImage
          profilePathname={profilePathname}
          className='mr-2'
          size='medium'
          alt={nickname}
        />
        <div>
          <div className='text-md text-slate-700 font-semibold'>{nickname}</div>
          <div className='text-sm text-gray-500 mb-2'>
            {createdDate.format('YYYY년 MM월 MM일')}{' '}
            <span title={updatedDate.format('YYYY년 MM월 MM일')}>
              {isUpdated ? `(${updatedDate.fromNow()} 업데이트)` : ``}
            </span>
          </div>
        </div>
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
