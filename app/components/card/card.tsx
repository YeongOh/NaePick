import { TCard, translatePublicity } from '@/app/lib/types';
import CardThumbnail from './card-thumbnail';
import Link from 'next/link';
import CardEllipsis from './card-ellipsis';
import CardUpdateLink from './card-update-link';
import { useRouter } from 'next/navigation';
import { forwardRef, useState } from 'react';
import Avatar from '../ui/Avatar';
import dayjs from '@/app/utils/dayjs';

export interface CardProps {
  worldcupCard: TCard;
  children?: React.ReactNode;
  extended?: boolean;
}

const Card = forwardRef<HTMLLIElement, CardProps>(function Card({ worldcupCard, extended }: CardProps, ref) {
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();

  const createdAt = dayjs(worldcupCard.createdAt);

  return (
    <li
      ref={ref}
      className={`mb-4 cursor-pointer rounded-xl p-1 transition-colors ${
        isActive ? `active:bg-primary-100` : ''
      }`}
      onMouseDown={(e) => {
        if (
          e.target instanceof HTMLElement &&
          !e.target.classList.contains('dropdown-menu-toggle') &&
          !e.target.classList.contains('dropdown-menu') &&
          !e.target.classList.contains('dropdown-button') &&
          !e.target.classList.contains('card-button')
        ) {
          setIsActive(true);
        } else {
          setIsActive(false);
        }
      }}
      onClick={(e) => {
        router.push(`/wc/${worldcupCard.id}`);
      }}
    >
      <div>
        <Link tabIndex={-1} href={`/wc/${worldcupCard.id}`} onClick={(e) => e.stopPropagation()}>
          <CardThumbnail worldcupCard={worldcupCard} />
        </Link>
        <div className="flex items-end justify-between p-1 md:p-0">
          <div className="flex-1">
            <div className="flex-start mt-2 flex">
              <Avatar
                alt={worldcupCard.nickname}
                profilePath={worldcupCard.profilePath}
                size="small"
                className="mr-2 mt-1"
              />
              <div className="flex-1">
                <Link href={`/wc/${worldcupCard.id}`}>
                  <h2
                    className="mb-1 line-clamp-2 cursor-pointer text-base font-bold text-slate-700 hover:underline"
                    title={worldcupCard.title}
                  >
                    {worldcupCard.title}
                  </h2>
                </Link>
                <div className="flex items-center text-md text-gray-500">
                  <span>{worldcupCard.nickname || '탈퇴한 회원'}</span>
                  <span className="ml-2" title={createdAt.format('YYYY년 MM월 DD일')}>
                    {createdAt.fromNow()}
                  </span>
                  {extended ? (
                    <span className="ml-2">{translatePublicity(worldcupCard.publicity)}</span>
                  ) : null}
                </div>
              </div>
              <CardEllipsis worldcupId={worldcupCard.id} title={worldcupCard.title} />
            </div>
            <div className="flex w-full items-center justify-between"></div>
          </div>
        </div>
      </div>
      {extended && <CardUpdateLink worldcupId={worldcupCard.id} />}
    </li>
  );
});

export default Card;
