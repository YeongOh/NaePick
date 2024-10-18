'use client';

import { Worldcup } from '@/app/lib/definitions';
import { BASE_IMAGE_URL } from '@/app/lib/images';
import Image from 'next/image';
import { useState } from 'react';

interface Props {
  defaultCandidates: any;
  post: Worldcup;
  worldcupId: string;
  round: number;
}

export default function PickScreen({
  defaultCandidates,
  post,
  worldcupId,
  round: paramRound,
}: Props) {
  const { title } = post;
  const maxRound = post.numberOfCandidates;
  const [round, setRound] = useState<number>(
    paramRound === 0 ? maxRound : paramRound > maxRound ? maxRound : paramRound
  );
  const [candidates, setCandidates] = useState(defaultCandidates);
  const [winners, setWinners] = useState<any>([]);
  const [losers, setLosers] = useState<any>([]);
  const [finalWinner, setFinalWinner] = useState<any>(null);
  const [picked, setPicked] = useState<'left' | 'right' | null>(null);
  const { url: leftUrl, name: leftAlt } = candidates[round - 2];
  const { url: rightUrl, name: rightAlt } = candidates[round - 1];
  function handlePick(target: 'left' | 'right') {
    const winner =
      target === 'left' ? candidates[round - 2] : candidates[round - 1];
    const loser =
      target === 'left' ? candidates[round - 1] : candidates[round - 2];
    setPicked(target);
    const finishedAt = Date.now();

    // 우승
    if (round === 2) {
      setFinalWinner(winner);
      // TODO: stat정산
      // sendStats(worldcupId, [...winners, winner], [...losers, loser], winner, [
      //   ...spentTime,
      //   duration,
      // ]);
      // 랭킹창, 댓글 보여주기

      return;
    }

    setTimeout(() => {
      let deleteIndex = target === 'left' ? round - 1 : round - 2;
      const nextCandidates = [
        ...candidates.slice(0, deleteIndex),
        ...candidates.slice(deleteIndex + 1),
      ];
      nextCandidates.unshift(nextCandidates.pop()!);
      setCandidates(nextCandidates);
      setWinners([...winners, winner]);
      setLosers([...losers, loser]);

      setRound((round) => round - 1);
      setPicked(null);
    }, 2000);
  }

  return (
    <>
      <section className='relative flex bg-black h-[90vh]'>
        <div className='absolute left-1/2 -translate-x-1/2 bg-black bg-opacity-30 z-50 w-full'>
          <h2 className='flex justify-center items-center text-white text-5xl p-2 font-bold'>
            {title} {getRoundsDescription(round)}
          </h2>
        </div>
        {finalWinner && (
          <div className='absolute left-1/2 bottom-[80px] -translate-x-1/2 bg-black bg-opacity-30 z-50 w-full'>
            <h2 className='flex justify-center items-center text-white text-5xl font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>
              {finalWinner.name} 우승!
            </h2>
          </div>
        )}
        <figure
          onClick={() => handlePick('left')}
          className={`w-1/2 cursor-pointer ${
            picked === 'left' && 'animate-pickLeft justify-center'
          } ${picked === 'right' && 'animate-moveLeft'}`}
        >
          <div className='relative w-full h-full flex'>
            <Image
              className='object-contain'
              src={`${BASE_IMAGE_URL}${leftUrl}`}
              alt={leftAlt}
              priority={true}
              fill={true}
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
            {!finalWinner && (
              <figcaption className='text-white absolute text-center bottom-[60px] text-5xl font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] w-full'>
                {leftAlt}
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
          onClick={() => handlePick('right')}
          className={`w-1/2 flex items-center justify-start cursor-pointer ${
            picked === 'left' && 'animate-moveRight'
          } ${picked === 'right' && 'animate-pickRight justify-center'}`}
        >
          <div className='relative w-full h-full'>
            <Image
              className='object-contain'
              src={`${BASE_IMAGE_URL}${rightUrl}`}
              alt={rightAlt}
              priority={true}
              fill={true}
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
            {!finalWinner && (
              <figcaption className='text-white absolute text-center bottom-[60px] text-5xl font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] w-full'>
                {rightAlt}
              </figcaption>
            )}
          </div>
        </figure>
      </section>
    </>
  );
}

function getRoundsDescription(round: number): string {
  if (round >= 63) return '64강';
  else if (round >= 31) return '32강';
  else if (round >= 15) return '16강';
  else if (round >= 7) return '8강';
  else if (round >= 3) return '준결승전';
  else if (round >= 1) return '결승전';
  return '';
}
