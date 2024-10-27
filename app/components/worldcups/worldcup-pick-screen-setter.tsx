'use client';

import { Candidate, Worldcup } from '@/app/lib/definitions';
import { useEffect, useState } from 'react';
import WorldcupPickScreen from './worldcup-pick-screen';
// import StartWorldcupModal from '../modal/start-worldcup-modal';
import { getRandomCandidatesByWorldcupId } from '@/app/lib/data/candidates';
import dynamic from 'next/dynamic';

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [round, setRounds] = useState<number | null>(null);
  const [openStartWorldcupModal, setOpenStartWorldcupModal] =
    useState<boolean>(true);

  const handleRoundSumbit = async (selectedRound: number) => {
    setOpenStartWorldcupModal(false);
    const randomCandidates = await getRandomCandidatesByWorldcupId(
      worldcup.worldcupId,
      selectedRound
    );
    setCandidates(randomCandidates || []);
    setRounds(selectedRound);
    setIsLoading(false);
  };

  if (isLoading)
    return (
      <>
        <section className='flex bg-black h-[calc(100vh-62px)] y-scroll-hidden'>
          <div className='absolute left-1/2 -translate-x-1/2 bg-black bg-opacity-30 z-50 w-full'>
            <h2 className='flex justify-center items-center text-white text-2clamp p-2 font-bold'>
              {worldcup.title} 곧 시작됩니다!
            </h2>
            <h3 className='flex justify-center items-center text-white text-1 clamp p-2 font-bold'>
              만든 사람 : {worldcup.nickname}
            </h3>
          </div>
          <StartWorldcupModal
            title={worldcup.title}
            open={openStartWorldcupModal}
            numberOfCandidates={worldcup.numberOfCandidates as number}
            onRoundSubmit={handleRoundSumbit}
          />
        </section>
      </>
    );

  return (
    <WorldcupPickScreen
      worldcup={worldcup}
      defaultCandidates={candidates}
      startingRound={round as number}
    />
  );
}
