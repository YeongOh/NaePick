'use client';

import { BASE_IMAGE_URL } from '@/app/constants';
import { submitMatchResult } from '@/app/lib/actions/statistics';
import { Candidate, MatchResult, Worldcup } from '@/app/lib/definitions';
import Image from 'next/image';
import { useState } from 'react';

interface Props {
  defaultCandidates: Candidate[];
  worldcup: Worldcup;
  startingRound: number;
}

export default function WorldcupPickScreen({
  defaultCandidates,
  worldcup,
  startingRound,
}: Props) {
  const [candidates, setCandidates] = useState<Candidate[]>(
    defaultCandidates.slice(0, startingRound)
  );
  const [matchResult, setMatchResult] = useState<MatchResult[]>([]);
  const [picked, setPicked] = useState<'left' | 'right'>();

  const round = candidates.length;
  const [leftIndex, rightIndex] = [round - 2, round - 1];
  const [leftCandidate, rightCandidate] = [
    candidates[leftIndex],
    candidates[rightIndex],
  ];
  const isFinished = round === 2 && picked;

  function handlePick(target: 'left' | 'right') {
    const winner = target === 'left' ? leftCandidate : rightCandidate;
    const loser = target === 'left' ? rightCandidate : leftCandidate;
    const winnerCandidateId = winner.candidateId;
    const loserCandidateId = loser.candidateId;
    setPicked(target);

    if (round == 2) {
      const matchResultToSubmit = [
        ...matchResult,
        { winnerCandidateId, loserCandidateId },
      ];
      submitMatchResult(matchResultToSubmit, worldcup.worldcupId);
      return;
    }

    setTimeout(() => {
      const newCandidates = [winner, ...candidates.toSpliced(leftIndex)];
      setCandidates(newCandidates);
      setMatchResult([...matchResult, { winnerCandidateId, loserCandidateId }]);
      setPicked(undefined);
    }, 2000);
  }

  return (
    <>
      <section className='relative flex bg-black h-[calc(100vh-62px)]'>
        <div className='absolute left-1/2 -translate-x-1/2 bg-black bg-opacity-30 z-50 w-full'>
          <h2 className='flex justify-center items-center text-white text-5xl p-2 font-bold'>
            {worldcup.title} {getRoundsDescription(round)}
          </h2>
        </div>
        {isFinished ? (
          <div className='absolute left-1/2 bottom-[60px] -translate-x-1/2 bg-black bg-opacity-30 z-50 w-full'>
            <h2 className='flex justify-center items-center text-white text-5xl font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>
              {picked === 'left'
                ? candidates[leftIndex].name
                : candidates[rightIndex].name}{' '}
              우승!
            </h2>
          </div>
        ) : null}
        <figure
          onClick={() => {
            if (picked) return;
            handlePick('left');
          }}
          className={`w-full cursor-pointer ${
            picked === 'left' && 'animate-expandLeft'
          } ${picked === 'right' && 'animate-shrinkRight'}`}
        >
          <div className='relative w-full h-full flex'>
            {picked !== 'right' && (
              <Image
                className='object-contain'
                src={`${BASE_IMAGE_URL}${leftCandidate.url}`}
                alt={leftCandidate.name}
                priority={true}
                fill={true}
                sizes='50vw'
              />
            )}
            {!isFinished && picked !== 'right' && (
              <figcaption className='text-white absolute text-center bottom-[60px] text-5xl font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] w-full'>
                {leftCandidate.name}
              </figcaption>
            )}
          </div>
          <span
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-500 text-7xl font-bold z-10 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] ${
              picked && 'hidden'
            }`}
          >
            VS
          </span>
        </figure>
        <figure
          onClick={() => {
            if (picked) return;
            handlePick('right');
          }}
          className={`w-full flex items-center justify-start cursor-pointer ${
            picked === 'left' && 'animate-shrinkLeft'
          } ${picked === 'right' && 'animate-expandRight'}`}
        >
          <div className='relative w-full h-full'>
            {picked !== 'left' && (
              <Image
                className='object-contain'
                src={`${BASE_IMAGE_URL}${rightCandidate.url}`}
                alt={rightCandidate.name}
                priority={true}
                fill={true}
                sizes='50vw'
              />
            )}
            {!isFinished && picked !== 'left' && (
              <figcaption className='text-white absolute text-center bottom-[60px] text-5xl font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] w-full'>
                {rightCandidate.name}
              </figcaption>
            )}
          </div>
        </figure>
      </section>
    </>
  );
}

function getRoundsDescription(round: number): string {
  if (round <= 2) return '결승전';
  if (round <= 4) return '준결승전';

  for (const each of [8, 16, 32, 64, 128, 256, 512, 1024]) {
    if (round <= each) {
      return `${each}강`;
    }
  }

  return '';
}