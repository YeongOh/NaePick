import { WorldcupCard } from '@/app/lib/definitions';
import CardThumbnail from './card-thumbnail';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import Link from 'next/link';
import CardEllipsis from './card-ellipsis';
import CardUpdateLink from './card-update-link';
import { useRouter } from 'next/navigation';
import { forwardRef, useState } from 'react';

export interface CardProps {
  worldcupCard: WorldcupCard;
  children?: React.ReactNode;
  openDropdownMenu: boolean;
  onOpenDropdownMenu: () => void;
  onCloseDropdownMenu: () => void;
  extended?: boolean;
}

const Card = forwardRef<HTMLLIElement, CardProps>(function Card(
  {
    worldcupCard,
    openDropdownMenu,
    onOpenDropdownMenu,
    onCloseDropdownMenu,
    extended,
  }: CardProps,
  ref
) {
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();
  dayjs.extend(relativeTime);
  dayjs.locale('ko');

  const createdAt = dayjs(worldcupCard.createdAt);

  return (
    <li
      ref={ref}
      className={`transition-colors rounded-xl cursor-pointer pb-4 lg:m-2 md:p-2 ${
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
        console.log(e.target);
        router.push(`/worldcups/${worldcupCard.worldcupId}`);
      }}
    >
      <div>
        <Link
          tabIndex={-1}
          href={`/worldcups/${worldcupCard.worldcupId}`}
          onClick={(e) => e.stopPropagation()}
        >
          <CardThumbnail worldcupCard={worldcupCard} />
        </Link>
        <div className='flex items-end justify-between p-1 md:p-0'>
          <div className='flex-1'>
            <div className='flex items-center'>
              <Link
                className='flex-1'
                href={`/worldcups/${worldcupCard.worldcupId}`}
              >
                <h2
                  className='text-md font-bold line-clamp-2 my-1.5 text-slate-700 hover:underline cursor-pointer'
                  title={worldcupCard.title}
                >
                  {worldcupCard.title}
                </h2>
              </Link>
              <CardEllipsis
                worldcupId={worldcupCard.worldcupId}
                title={worldcupCard.title}
                openDropdownMenu={openDropdownMenu}
                onOpenDropdownMenu={onOpenDropdownMenu}
                onCloseDropdownMenu={onCloseDropdownMenu}
              />
            </div>
            <div className='flex items-center justify-between w-full'>
              <div className='text-md text-gray-500'>
                <span>{worldcupCard.nickname}</span>
                <span
                  className='ml-2'
                  title={createdAt.format('YYYY년 MM월 DD일')}
                >
                  {createdAt.fromNow()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {extended && <CardUpdateLink worldcupId={worldcupCard.worldcupId} />}
    </li>
  );
});

export default Card;
