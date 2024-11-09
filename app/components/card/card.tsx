import { translatePublicity, WorldcupCard } from '@/app/lib/types';
import CardThumbnail from './card-thumbnail';
import 'dayjs/locale/ko';
import Link from 'next/link';
import CardEllipsis from './card-ellipsis';
import CardUpdateLink from './card-update-link';
import { useRouter } from 'next/navigation';
import { forwardRef, useState } from 'react';
import Avatar from '../ui/Avatar';
import dayjs from '@/app/utils/dayjs';

export interface CardProps {
  worldcupCard: WorldcupCard;
  children?: React.ReactNode;
  openDropdownMenu: boolean;
  onOpenDropdownMenu: () => void;
  onCloseDropdownMenu: () => void;
  extended?: boolean;
}

const Card = forwardRef<HTMLLIElement, CardProps>(function Card(
  { worldcupCard, openDropdownMenu, onOpenDropdownMenu, onCloseDropdownMenu, extended }: CardProps,
  ref
) {
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();

  const createdAt = dayjs(worldcupCard.createdAt);

  return (
    <li
      ref={ref}
      className={`transition-colors rounded-xl cursor-pointer mb-4 p-1 ${
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
            <div className="flex flex-start mt-2">
              <Avatar
                alt={worldcupCard.nickname}
                profilePath={worldcupCard.profilePathname}
                size="small"
                className="mt-1 mr-2"
              />
              <div className="flex-1">
                <Link href={`/wc/${worldcupCard.id}`}>
                  <h2
                    className="text-base font-bold line-clamp-2 text-slate-700 hover:underline cursor-pointer mb-1"
                    title={worldcupCard.title}
                  >
                    {worldcupCard.title}
                  </h2>
                </Link>
                <div className="text-md text-gray-500 flex items-center">
                  <span>{worldcupCard.nickname}</span>
                  <span className="ml-2" title={createdAt.format('YYYY년 MM월 DD일')}>
                    {createdAt.fromNow()}
                  </span>
                  {extended ? (
                    <span className="ml-2">{translatePublicity(worldcupCard.publicity)}</span>
                  ) : null}
                </div>
              </div>
              <CardEllipsis
                worldcupId={worldcupCard.id}
                title={worldcupCard.title}
                openDropdownMenu={openDropdownMenu}
                onOpenDropdownMenu={onOpenDropdownMenu}
                onCloseDropdownMenu={onCloseDropdownMenu}
              />
            </div>
            <div className="flex items-center justify-between w-full"></div>
          </div>
        </div>
      </div>
      {extended && <CardUpdateLink worldcupId={worldcupCard.worldcupId} />}
    </li>
  );
});

export default Card;
