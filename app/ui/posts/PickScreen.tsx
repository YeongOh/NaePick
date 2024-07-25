'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Props {
  defaultCandidates: any;
  totalRounds: any;
  title: any;
}

export default function PickScreen({
  defaultCandidates,
  totalRounds,
  title,
}: Props) {
  const [round, setRound] = useState<number>(totalRounds);
  const [candidates, setCandidates] = useState(defaultCandidates);
  const [picked, setPicked] = useState<'left' | 'right' | null>(null);
  console.log(defaultCandidates);
  console.log(totalRounds);

  const { url: leftUrl, name: leftAlt } = candidates[round - 2];
  const { url: rightUrl, name: rightAlt } = candidates[round - 1];
  const currentRound = totalRounds - round;

  useEffect(
    () => localStorage.setItem('default', JSON.stringify(defaultCandidates)),
    [defaultCandidates]
  );

  useEffect(() => {
    let stored, metaData, winner, progress;
    if (picked === 'left') winner = { url: leftUrl, name: leftAlt };
    else if (picked === 'right') winner = { url: rightUrl, name: rightAlt };
    else return;

    if (!(stored = localStorage.getItem('progress'))) {
      progress = [{ totalRounds, round }, winner];
    } else {
      stored = JSON.parse(stored);
      metaData = stored[0];
      progress = [{ ...metaData, round }, ...stored.slice(1), winner];
    }
    localStorage.setItem('progress', JSON.stringify(progress));
  }, [picked]);

  function handlePick(target: 'left' | 'right') {
    setPicked(target);
    if (round === 2) {
      return; // 우승
    }

    setTimeout(() => {
      let deleteIndex = target === 'left' ? round - 1 : round - 2;
      const nextCandidates = [
        ...candidates.slice(0, deleteIndex),
        ...candidates.slice(deleteIndex + 1),
      ];
      nextCandidates.unshift(nextCandidates.pop()!);
      setCandidates(nextCandidates);

      setRound((round) => round - 1);
      setPicked(null);
      console.log(candidates);
    }, 2000);
  }

  return (
    <>
      <div className='relative flex bg-black h-[90vh]'>
        <div className='absolute left-1/2 top-4 -translate-x-1/2 bg-black text-xl'>
          <h2 className='flex justify-center items-center text-white'>
            {title} {getRoundsDescription(round)} - {currentRound + 1} /{' '}
            {totalRounds}
          </h2>
        </div>
        <figure
          className={`relative w-1/2 flex items-center justify-end h-auto cursor-pointer ${
            picked === 'left' && 'animate-pickLeft'
          } ${picked === 'right' && 'animate-moveLeft'}`}
        >
          <Image
            className='w-fit'
            onClick={() => handlePick('left')}
            src={leftUrl}
            alt={leftAlt}
            priority={true}
            width={0}
            height={0}
            sizes='100vw'
          />
          <figcaption className='text-white absolute left-1/2 -translate-x-1/2 bottom-[20px] text-xl'>
            {leftAlt}
          </figcaption>
          <span
            className={`absolute translate-x-1/2 bg-black text-white z-10 ${
              picked && 'hidden'
            }`}
          >
            VS
          </span>
        </figure>
        <figure
          className={`relative w-1/2 flex items-center justify-start cursor-pointer ${
            picked === 'left' && 'animate-moveRight'
          } ${picked === 'right' && 'animate-pickRight'}`}
        >
          <Image
            onClick={() => handlePick('right')}
            className='w-fit'
            src={rightUrl}
            alt={rightAlt}
            priority={true}
            width={0}
            height={0}
            sizes='100vw'
          />
          <figcaption className='text-white absolute left-1/2 -translate-x-1/2 bottom-[20px] text-xl'>
            {rightAlt}
          </figcaption>
        </figure>
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
