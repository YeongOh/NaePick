'use client';

import Link from 'next/link';
import { useState } from 'react';
import StartWorldcupModal from '../modal/start-worldcup-modal';
import ShareWorldcupModal from '../modal/share-worldcup-modal';

interface Props {
  worldcupId: string;
  numberOfCandidates: number;
  title: string;
}

export default function DirectCardLink({
  worldcupId,
  numberOfCandidates,
  title,
}: Props) {
  const [showStartWorldCupModal, setShowStartWorldCupModal] = useState(false);
  const [showShareWorldCupModal, setShowShareWorldCupModal] = useState(false);

  return (
    <>
      <div className='mt-4 flex gap-8 text-lg'>
        <button
          className='flex-1 py-4 rounded text-primary-500'
          onClick={() => setShowShareWorldCupModal(true)}
        >
          공유
        </button>
        <Link
          className='flex-1 py-4 rounded text-primary-700 bg-gray-100 text-center'
          href={`/worldcups/${worldcupId}/statistics`}
        >
          랭킹
        </Link>
        <button
          className='font-semibold flex-1 py-4 bg-primary-500 text-white rounded'
          onClick={() => setShowStartWorldCupModal(true)}
        >
          시작
        </button>
      </div>
      <ShareWorldcupModal
        open={showShareWorldCupModal}
        onClose={() => setShowShareWorldCupModal(false)}
        worldcupId={worldcupId}
        title={title}
      />
      <StartWorldcupModal
        open={showStartWorldCupModal}
        onClose={() => setShowStartWorldCupModal(false)}
        worldcupId={worldcupId}
        numberOfCandidates={numberOfCandidates}
        title={title}
      />
    </>
  );
}
