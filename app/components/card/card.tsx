import { WorldcupCard } from '@/app/lib/definitions';
import CardThumbnail from './card-thumbnail';
import CardLink from '../card-extensions/card-link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

interface Props {
  worldcupCard: WorldcupCard;
  children?: React.ReactNode;
}

export default function Card({ worldcupCard, children }: Props) {
  dayjs.extend(relativeTime);
  dayjs.locale('ko');
  console.log(worldcupCard);

  return (
    <li className='p-4 w-[330px] mb-4'>
      <div className='h-[230px]'>
        <CardThumbnail worldcupCard={worldcupCard} />
        <div className='flex items-end justify-between'>
          <div className='flex-1 overflow-hidden'>
            <h2
              className='text-lg font-bold line-clamp-2 my-1.5 text-slate-700'
              title={worldcupCard.title}
            >
              {worldcupCard.title}
            </h2>
            <div className='flex items-center justify-between w-full'>
              <div className='text-base text-gray-500'>
                <span>{worldcupCard.nickname}</span>
                <span
                  className='ml-2'
                  title={dayjs(worldcupCard.createdAt).toString()}
                >
                  {dayjs(worldcupCard.createdAt).fromNow()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CardLink
        worldcupId={worldcupCard.worldcupId}
        title={worldcupCard.title}
      />
      {children}
    </li>
  );
}
