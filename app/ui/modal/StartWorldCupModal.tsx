'use client';

import { DEFAULT_ROUNDS, getNumberOfRoundsAvailable } from '@/app/constants';
import Link from 'next/link';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  open: boolean;
  onClose: any;
  postId: string;
  numberOfCandidates: number;
  title: string;
}

export default function StartWorldCupModal({
  open,
  onClose,
  postId,
  numberOfCandidates,
  title,
}: Props) {
  const availableRounds = getNumberOfRoundsAvailable(numberOfCandidates);
  const [round, setRound] = useState<number>(
    numberOfCandidates >= DEFAULT_ROUNDS
      ? DEFAULT_ROUNDS
      : Math.max(...availableRounds)
  );

  const handleRoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetRound = Number(e.target.value);
    setRound(targetRound);
  };

  return (
    <>
      {open &&
        createPortal(
          <div
            className='fixed inset-0 z-99 bg-black/30 w-screen h-screen'
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border bg-white rounded-xl p-4 min-w-[300px]'
            >
              <div className='flex flex-col items-center justify-between'>
                <h2 className='text-lg font-semibold m-4'>{title}</h2>
                <select
                  id={`${title} round`}
                  name='round'
                  className={`w-full flex-1 peer block cursor-pointer rounded-md border border-gray-200 p-2 outline-2 focus:outline-primary-500 mb-4 text-base`}
                  defaultValue={round}
                  onChange={handleRoundChange}
                >
                  {availableRounds.map((round) => (
                    <option key={round} value={round}>
                      {`${round}강`}
                    </option>
                  ))}
                </select>
                <div className='m-4'>
                  <button
                    className='text-primary-500 px-4 py-2'
                    onClick={onClose}
                  >
                    취소
                  </button>
                  <Link
                    className='bg-primary-500 text-white px-4 py-2 rounded'
                    href={`/posts/${postId}/2`}
                  >
                    시작하기!
                  </Link>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
