'use client';

import Link from 'next/link';
import { useState } from 'react';
import ShareWorldcupModal from '../modal/share-worldcup-modal';
import StartWorldcupModal from '../modal/start-worldcup-modal';

interface Props {
  postId: string;
  numberOfCandidates: number;
  title: string;
}

export default function CardLink({ postId, numberOfCandidates, title }: Props) {
  const [showStartWorldCupModal, setShowStartWorldCupModal] = useState(false);
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
          href={`/worldcups/${postId}/statistics`}
        >
          랭킹
        </Link>
        <button
          className='font-semibold flex-1 py-2 bg-primary-500 text-white rounded'
          onClick={() => setShowStartWorldCupModal(true)}
        >
          시작
        </button>
      </div>
      <ShareWorldcupModal
        open={showShareWorldCupModal}
        onClose={() => setShowShareWorldCupModal(false)}
        postId={postId}
        title={title}
      />
      <StartWorldcupModal
        open={showStartWorldCupModal}
        onClose={() => setShowStartWorldCupModal(false)}
        postId={postId}
        numberOfCandidates={numberOfCandidates}
        title={title}
      />
    </>
  );
}
