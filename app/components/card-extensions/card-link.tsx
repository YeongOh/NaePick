'use client';

import Link from 'next/link';
import { useState } from 'react';
import ShareWorldcupModal from '../modal/share-worldcup-modal';

interface Props {
  worldcupId: string;
  title: string;
}

export default function CardLink({ worldcupId, title }: Props) {
  const [showShareWorldCupModal, setShowShareWorldCupModal] = useState(false);

  return (
    <>
      <div className='mt-4 flex gap-4 text-base'>
        <button
          className='flex-1 py-2 rounded text-primary-500'
          onClick={() => setShowShareWorldCupModal(true)}
        >
          공유
        </button>
        <Link
          className='flex-1 py-2 rounded text-primary-700 bg-gray-100 text-center'
          href={`/worldcups/${worldcupId}/statistics`}
        >
          랭킹
        </Link>
        <Link
          className='flex-1 py-2 rounded bg-primary-500 text-white text-center'
          href={`/worldcups/${worldcupId}`}
        >
          시작
        </Link>
      </div>
      <ShareWorldcupModal
        open={showShareWorldCupModal}
        onClose={() => setShowShareWorldCupModal(false)}
        worldcupId={worldcupId}
        title={title}
      />
    </>
  );
}
