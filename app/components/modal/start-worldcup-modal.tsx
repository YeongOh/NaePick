'use client';

import { DEFAULT_ROUNDS, getNumberOfRoundsAvailable } from '@/app/constants';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  open: boolean;
  onClose?: () => void;
  onRoundSubmit: (round: number) => void;
  worldcupId?: string;
  numberOfCandidates: number;
  title: string;
}

export default function StartWorldcupModal({
  open,
  onClose,
  onRoundSubmit,
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
            className='modal fixed inset-0 z-99 bg-black/80 w-screen h-screen y-scroll-hidden'
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border bg-white rounded-xl p-4 min-w-[320px]'
            >
              <div className='flex flex-col items-center justify-between'>
                <h2 className='text-lg font-semibold m-4'>{title}</h2>
                <select
                  id={`${title} round`}
                  name='round'
                  className={`w-full text-center flex-1 peer block cursor-pointer rounded-md border border-gray-200 p-2 outline-2 focus:outline-primary-500 mb-4 text-base`}
                  defaultValue={round}
                  onChange={handleRoundChange}
                >
                  {availableRounds.map((round) => (
                    <option key={round} value={round}>
                      {`${round}강`}
                    </option>
                  ))}
                </select>
                <div className='flex w-full gap-4'>
                  <button
                    className='flex-1 text-primary-500 text-base px-4 py-2 text-center'
                    onClick={onClose}
                  >
                    돌아가기
                  </button>
                  <button
                    className='flex-1 text-base bg-primary-500 text-center text-white px-4 py-2 rounded'
                    onClick={() => onRoundSubmit(round)}
                  >
                    시작하기!
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
