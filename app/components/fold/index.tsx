'use client';

import { Worldcup } from '@/app/lib/definitions';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import Link from 'next/link';
import ShareWorldcupModal from '../modal/share-worldcup-modal';
import { useState } from 'react';

interface Props {
  worldcup: Worldcup;
}

export default function Fold({ worldcup }: Props) {
  const {
    worldcupId,
    title,
    publicity,
    nickname,
    createdAt,
    updatedAt,
    description,
  } = worldcup;
  const [showShareWorldCupModal, setShowShareWorldCupModal] = useState(false);

  dayjs.extend(relativeTime);
  dayjs.locale('ko');

  const createdDate = dayjs(createdAt);
  // Data에서 나중에 지워야함
  const updatedDate = dayjs(updatedAt);
  const isUpdated = createdDate.diff(updatedDate);

  return (
    <>
      <section className='p-8'>
        <div className='flex mb-2'>
          <h2 className='font-bold text-3xl text-slate-700'>{title}</h2>
        </div>
        <div className='flex gap-4 mb-2 items-center justify-between'>
          <div className='flex items-center'>
            <div className='text-slate-700 text-base'>
              <p className='text-lg font-semibold mb-2'>{nickname}</p>
              <p>
                <span className='mr-2 font-semibold'>
                  {dayjs(createdAt).format('YYYY. MM.DD.')}
                </span>
                {isUpdated ? (
                  <span
                    className='text-gray-500'
                    title={dayjs(updatedAt).format('YYYY. MM.DD. HH시 MM분')}
                  >
                    (업데이트: {dayjs(updatedAt).fromNow()})
                  </span>
                ) : null}
              </p>
            </div>
            <span className='text-base ml-6 text-white bg-primary-500 px-3 py-2 rounded-full font-semibold'>
              {translatePublicity(publicity)}
            </span>
          </div>
          <div>
            <Link
              className='bg-gray-100 px-4 py-2 rounded-md mr-4'
              href={`/worldcups/${worldcupId}/stats`}
            >
              통계 보기
            </Link>
            <button
              className='flex-1 py-2 rounded text-primary-500'
              onClick={() => setShowShareWorldCupModal(true)}
            >
              공유 하기
            </button>
          </div>
        </div>
        <p className='mt-4'>{description}</p>
      </section>
      <ShareWorldcupModal
        open={showShareWorldCupModal}
        onClose={() => setShowShareWorldCupModal(false)}
        worldcupId={worldcupId}
        title={title}
      />
    </>
  );
}

function translatePublicity(text: string) {
  switch (text) {
    case 'public':
      return '공개';
    case 'unlisted':
      return '미등록';
    default:
      return '비공개';
  }
}
