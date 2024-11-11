import dayjs from '@/app/utils/dayjs';
import ToggleableP from '../../../../components/ui/toggleable-p';
import Avatar from '../../../../components/ui/Avatar';

interface Props {
  nickname: string | null;
  createdAt: string;
  updatedAt: string;
  description: string | null;
  profilePath: string | null;
}

export default function WorldcupFold({ nickname, createdAt, updatedAt, description, profilePath }: Props) {
  const createdDate = dayjs(createdAt).tz();
  const updatedDate = dayjs(updatedAt).tz();
  const isUpdated = createdDate.diff(updatedDate);

  return (
    <>
      <div className="flex items-center mb-1">
        <Avatar
          profilePath={profilePath}
          className="mr-2"
          size="medium"
          alt={nickname ? nickname : '탈퇴한 회원'}
        />
        <div>
          <div className="text-base text-slate-700 font-semibold">{nickname}</div>
          <div className="text-sm text-gray-500 mb-2">
            {createdDate.format('YYYY년 MM월 MM일')}{' '}
            <span title={updatedDate.format('YYYY년 MM월 MM일')}>
              {isUpdated ? `(${updatedDate.fromNow()} 업데이트)` : ``}
            </span>
          </div>
        </div>
      </div>
      <div className="mb-5">
        <ToggleableP
          className="text-slate-700 w-full"
          numberOfLines={6}
          text={description ? description : ''}
        />
      </div>
    </>
  );
}
