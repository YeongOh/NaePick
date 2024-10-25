import { WorldcupCard } from '@/app/lib/definitions';
import ThumbnailImage from '../thumbnail/ThumbnailImage';
import CardLink from '../card-extensions/card-link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

interface Props {
  worldcup: WorldcupCard;
  children?: React.ReactNode;
}

export default function Card({ worldcup, children }: Props) {
  dayjs.extend(relativeTime);
  dayjs.locale('ko');

  return (
    <li className='p-4 w-[330px] mb-4'>
      <div className='h-[230px]'>
        <ThumbnailImage
          leftCandidateUrl={worldcup.leftCandidateUrl}
          leftCandidateName={worldcup.leftCandidateName}
          rightCandidateUrl={worldcup.rightCandidateUrl}
          rightCandidateName={worldcup.rightCandidateName}
        />
        <div className='flex items-end justify-between'>
          <div className='flex-1 overflow-hidden'>
            <h2
              className='text-lg font-bold line-clamp-2 my-1.5 text-slate-700'
              title={worldcup.title}
            >
              {worldcup.title}
            </h2>
            <div className='flex items-center justify-between w-full'>
              <div className='text-base text-gray-500'>
                <span>{worldcup.nickname}</span>
                <span
                  className='ml-2'
                  title={dayjs(worldcup.createdAt).toString()}
                >
                  {dayjs(worldcup.createdAt).fromNow()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CardLink
        worldcupId={worldcup.worldcupId}
        numberOfCandidates={worldcup.numberOfCandidates}
        title={worldcup.title}
      />
      {children}
    </li>
  );
}
