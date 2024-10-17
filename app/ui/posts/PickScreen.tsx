'use client';

import { getNumberOfRoundsAvailable } from '@/app/constants';
import { sendStats } from '@/app/lib/actions/ranks';
import { Post } from '@/app/lib/definitions';
import { BASE_IMAGE_URL } from '@/app/lib/images';
import Image from 'next/image';
import { useState } from 'react';

interface Props {
  defaultCandidates: any;
  post: Post;
  postId: string;
  round: number;
}

export default function PickScreen({
  defaultCandidates,
  post,
  postId,
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
  const [spentTime, setSpentTime] = useState<number[]>([]);
  const [finalWinner, setFinalWinner] = useState<any>(null);
  const [picked, setPicked] = useState<'left' | 'right' | null>(null);
  const { url: leftUrl, name: leftAlt } = candidates[round - 2];
  const { url: rightUrl, name: rightAlt } = candidates[round - 1];
  const startedAt = Date.now();

  function resetProgress() {
    setWinners([]);
    setLosers([]);
    setSpentTime([]);
    setFinalWinner(null);
    setPicked(null);
  }

  function handlePick(target: 'left' | 'right') {
    const winner =
      target === 'left' ? candidates[round - 2] : candidates[round - 1];
    const loser =
      target === 'left' ? candidates[round - 1] : candidates[round - 2];
    setPicked(target);
    const finishedAt = Date.now();
    const duration = Math.ceil((finishedAt - startedAt) / 1000);

    // 우승
    if (round === 2) {
      setFinalWinner(winner);
      setSpentTime([...spentTime, duration]);
      sendStats(postId, [...winners, winner], [...losers, loser], winner, [
        ...spentTime,
        duration,
      ]);
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
      setSpentTime([...spentTime, duration]);

      setRound((round) => round - 1);
      setPicked(null);
    }, 2000);
  }

  const handleRoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const targetRound = Number(e.target.value);
    setRound(targetRound);
    resetProgress();
  };

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
          {/* <span
              className={`absolute translate-x-1/2 text-primary-500 text-7xl font-bold z-10 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] ${
                picked && 'hidden'
              }`}
            >
              VS
            </span> */}
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
      <div className='m-4'>
        <select
          id='round'
          name='round'
          className={`peer block w-full cursor-pointer rounded-md border border-gray-200 p-2 outline-2 placeholder:text-gray-500 focus:outline-primary-500 mb-4`}
          defaultValue={''}
          onChange={handleRoundChange}
        >
          <option value='' disabled>
            강 바꾸기 (현재 {`${round}강`} - 바꿀 시 진행 초기화)
          </option>
          {getNumberOfRoundsAvailable(post.numberOfCandidates).map(
            (availableRound) => (
              <option
                key={availableRound}
                value={availableRound}
                disabled={round === availableRound}
              >
                {`${availableRound}강`}
              </option>
            )
          )}
        </select>
      </div>
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
