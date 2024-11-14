import Avatar from '@/app/components/ui/Avatar';
import ToggleableP from '@/app/components/ui/toggleable-p';
import dayjs from '@/app/utils/dayjs';

interface Props {
  nickname: string | null;
  createdAt: string;
  updatedAt: string;
  description: string | null;
  profilePath: string | null;
}

export default function WorldcupFold({ nickname, createdAt, updatedAt, description, profilePath }: Props) {
  const createdDate = dayjs(createdAt);
  const updatedDate = dayjs(updatedAt);
  const isUpdated = createdDate.diff(updatedDate);

  return (
    <>
      <div className="mb-1 flex items-center">
        <Avatar
          profilePath={profilePath}
          className="mr-2"
          size="medium"
          alt={nickname ? nickname : '탈퇴한 회원'}
        />
        <div>
          <div className="text-base font-semibold text-slate-700">{nickname}</div>
          <div className="mb-2 text-sm text-gray-500">
            {createdDate.format('YYYY년 MM월 MM일')}{' '}
            <span title={updatedDate.format('YYYY년 MM월 MM일')}>
              {isUpdated ? `(${updatedDate.fromNow()} 업데이트)` : ``}
            </span>
          </div>
        </div>
      </div>
      <div className="mb-5">
        <ToggleableP
          className="w-full text-slate-700"
          numberOfLines={6}
          text={description ? description : ''}
        />
      </div>
    </>
  );
}
