'use client';

import Link from 'next/link';
import { useState } from 'react';
import StartWorldCupModal from '../modal/StartWorldCupModal';
import ShareWorldCupModal from '../modal/ShareWorldCupModal';

interface Props {
  postId: string;
  numberOfCandidates: number;
  title: string;
}

export default function DirectCardLink({
  postId,
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
          href={`/posts/ranks/${postId}`}
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
      <ShareWorldCupModal
        open={showShareWorldCupModal}
        onClose={() => setShowShareWorldCupModal(false)}
        postId={postId}
        title={title}
      />
      <StartWorldCupModal
        open={showStartWorldCupModal}
        onClose={() => setShowStartWorldCupModal(false)}
        postId={postId}
        numberOfCandidates={numberOfCandidates}
        title={title}
      />
    </>
  );
}
