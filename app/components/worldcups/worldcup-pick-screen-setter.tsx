'use client';

import { Candidate, Worldcup } from '@/app/lib/definitions';
import { useEffect, useState } from 'react';
import WorldcupPickScreen from './worldcup-pick-screen';
// import StartWorldcupModal from '../modal/start-worldcup-modal';
import { getRandomCandidatesByWorldcupId } from '@/app/lib/data/candidates';
import dynamic from 'next/dynamic';
import { MIN_NUMBER_OF_CANDIDATES } from '@/app/constants';

const StartWorldcupModal = dynamic(
  () => import('../modal/start-worldcup-modal'),
  {
    ssr: false,
  }
);

interface Props {
  worldcup: Worldcup;
}

export default function WorldcupPickScreenSetter({ worldcup }: Props) {
  const [isSelectingRounds, setIsSelectingRounds] = useState<boolean>(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [round, setRounds] = useState<number | null>(null);
  const [openStartWorldcupModal, setOpenStartWorldcupModal] =
    useState<boolean>(true);

  const notEnoughCandidates =
    (worldcup.numberOfCandidates as number) < MIN_NUMBER_OF_CANDIDATES;

  const handleRoundSumbit = async (selectedRound: number) => {
    setOpenStartWorldcupModal(false);
    const randomCandidates = await getRandomCandidatesByWorldcupId(
      worldcup.worldcupId,
      selectedRound
    );
    setCandidates(randomCandidates || []);
    setRounds(selectedRound);
    setIsSelectingRounds(false);
  };

  if (isSelectingRounds) {
    return (
      <>
        <section className='flex bg-black h-[calc(100vh-62px)]'>
          <div className='absolute left-1/2 -translate-x-1/2 bg-black bg-opacity-30 z-50 w-full'>
            <h2 className='text-center text-white text-2clamp p-2 font-bold'>
              {worldcup.title}{' '}
              {notEnoughCandidates ? (
                <>
                  <br />
                  준비 중인 이상형 월드컵입니다.
                </>
              ) : (
                <>
                  <br />곧 시작됩니다!
                </>
              )}
            </h2>
          </div>
          <StartWorldcupModal
            nickname={worldcup.nickname}
            title={worldcup.title}
            description={worldcup.description}
            open={openStartWorldcupModal}
            createdAt={worldcup.createdAt}
            updatedAt={worldcup.updatedAt}
            numberOfCandidates={worldcup.numberOfCandidates as number}
            onRoundSubmit={handleRoundSumbit}
          />
        </section>
      </>
    );
  }

  return (
    <WorldcupPickScreen
      worldcup={worldcup}
      defaultCandidates={candidates}
      startingRound={round as number}
    />
  );
}
