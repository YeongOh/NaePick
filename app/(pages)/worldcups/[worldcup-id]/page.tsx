import { fetchWorldcupCardByWorldcupId } from '@/app/lib/data/worldcups';
import { BASE_IMAGE_URL } from '@/app/lib/images';
import DirectCardLink from '@/app/components/card-extensions/direct-card-link';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import { getSession } from '@/app/lib/actions/session';

interface Props {
  params: { ['worldcup-id']: string; round: string };
}

export default async function Page({ params }: Props) {
  const worldcupId = params['worldcup-id'];
  const [worldcup, session] = await Promise.all([
    fetchWorldcupCardByWorldcupId(worldcupId),
    getSession(),
  ]);
  dayjs.extend(relativeTime);
  dayjs.locale('ko');

  if (!worldcup || !worldcup[0]) {
    notFound();
  }
  const {
    leftCandidateUrl,
    leftCandidateName,
    rightCandidateName,
    rightCandidateUrl,
    title,
    description,
    publicity,
    createdAt,
    numberOfCandidates,
    nickname,
    userId,
  } = worldcup[0];

  if (publicity === 'private' && session?.userId !== userId) {
    redirect('/forbidden');
  }

  return (
    <div className='max-w-screen-md w-screen m-auto'>
      <>
        <div
          className={`inline-flex bg-black w-full h-[500px] overflow-hidden rounded-xl mt-10`}
        >
          {leftCandidateUrl && (
            <>
              <div className='relative w-1/2'>
                <Image
                  className='object-cover'
                  src={`${BASE_IMAGE_URL}${leftCandidateUrl}`}
                  alt={leftCandidateName}
                  fill={true}
                  sizes='(max-width: 768px) 66vw, (max-width: 1200px) 33vw'
                  priority={true}
                />
                <div className='bg-black/30 absolute h-auto bottom-0 w-full'>
                  <p
                    className='text-center text-white text-2xl truncate drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-bold'
                    title={leftCandidateName}
                  >
                    {leftCandidateName}
                  </p>
                </div>
              </div>
            </>
          )}
          {rightCandidateUrl && (
            <div className='relative w-1/2'>
              <Image
                className='object-cover'
                src={`${BASE_IMAGE_URL}${rightCandidateUrl}`}
                alt={rightCandidateName}
                fill={true}
                sizes='(max-width: 768px) 66vw, (max-width: 1200px) 33vw'
                priority={true}
              />
              <div className='bg-black/30 absolute h-auto bottom-0 w-full'>
                <p
                  className='text-center text-white text-2xl truncate drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-bold'
                  title={rightCandidateName}
                >
                  {rightCandidateName}
                </p>
              </div>
            </div>
          )}
        </div>
        <h1 className='text-slate-700 text-xl font-bold m-2  '>{title}</h1>
        <div className='w-full m-2 text-gray-500'>
          <span> {nickname}</span>
          <span className='ml-2' title={dayjs(createdAt).toString()}>
            {dayjs(createdAt).fromNow()}
          </span>
        </div>
        <p className='m-2 line-clamp-3'>{description}</p>

        <DirectCardLink
          worldcupId={worldcupId}
          numberOfCandidates={numberOfCandidates}
          title={title}
        />
      </>
    </div>
  );
}
