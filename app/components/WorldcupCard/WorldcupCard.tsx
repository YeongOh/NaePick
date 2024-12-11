import clsx from 'clsx';
import Link from 'next/link';
import { WorldcupCardContext } from '@/app/hooks/useWorldcupCard';
import { TCard } from '@/app/lib/types';
import Avatar from '@/app/ui/Avatar';
import dayjs from '@/app/utils/dayjs';
import WorldcupCardMenuButton from './WorldcupCardDropdownButton';
import WorldcupCardThumbnail from './WorldcupCardThumbnail';

export interface Props {
  worldcupCard: TCard;
  className?: string;
  type?: 'default' | 'update' | 'favourite';
}

export default function WorldcupCard({ worldcupCard, className, type = 'default' }: Props) {
  const { createdAt, id, nickname, profilePath, title, matchCount } = worldcupCard;
  const createdAtDayJs = dayjs(createdAt);

  return (
    <WorldcupCardContext.Provider value={{ worldcupCard, type }}>
      <li className={clsx('rounded-xl p-1 transition-colors', className)}>
        <Link href={`/wc/${id}`} onClick={(e) => e.stopPropagation()} tabIndex={-1}>
          <WorldcupCardThumbnail />
        </Link>
        <div className="w-full">
          <div className="mt-1 flex">
            <Avatar alt={nickname} profilePath={profilePath} size="sm" className="mr-2" />
            <div className="flex-1">
              <Link href={`/wc/${id}`}>
                <h2
                  className="mb-0.5 line-clamp-2 cursor-pointer text-base font-bold text-slate-700 hover:underline"
                  title={title}
                >
                  {title}
                </h2>
              </Link>
              <div className="text-md text-gray-500">
                <div>{nickname || '탈퇴한 회원'}</div>
                <div className="flex">
                  <div>투표수 {matchCount}회</div>
                  <span className="mx-1"> • </span>
                  <span className="" title={createdAtDayJs.format('YYYY년 MM월 DD일')}>
                    {createdAtDayJs.fromNow()}
                  </span>
                </div>
              </div>
            </div>
            <WorldcupCardMenuButton />
          </div>
        </div>
      </li>
    </WorldcupCardContext.Provider>
  );
}
