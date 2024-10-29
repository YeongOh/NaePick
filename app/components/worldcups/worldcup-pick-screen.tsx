'use client';

import { submitMatchResult } from '@/app/lib/actions/statistics/create-match-result';
import { Candidate, MatchResult, Worldcup } from '@/app/lib/definitions';
import MyImage from '@/app/components/ui/my-image/my-image';
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
  console.log(candidates);

  return (
    <>
      <section className='relative flex bg-black h-[calc(100vh-62px)]'>
        <div className='absolute left-1/2 -translate-x-1/2 bg-black bg-opacity-30 z-50 w-full'>
          <h2 className='flex justify-center items-center text-white text-2clamp p-2 font-bold'>
            {worldcup.title} {getRoundsDescription(round)}
          </h2>
        </div>
        {isFinished ? (
          <div className='absolute left-1/2 bottom-[60px] -translate-x-1/2 bg-black bg-opacity-30 z-50 w-full'>
            <h2 className='flex justify-center items-center text-white text-2clamp font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>
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
          className={`w-1/2 cursor-pointer flex justify-end ${
            picked === 'left' && 'animate-expandLeft'
          } ${picked === 'right' && 'animate-shrinkRight'}`}
        >
          {picked !== 'right' && leftCandidate.mediaType === 'cdn_video' && (
            <div className='max-w-fit size-full'>
              <video
                className='w-full h-full object-contain'
                autoPlay
                playsInline
                loop
                muted
              >
                <source
                  src={`https://cdn.naepick.co.kr/${leftCandidate.pathname}`}
                  type='video/mp4'
                />
              </video>
            </div>
          )}
          {picked !== 'right' && leftCandidate.mediaType === 'cdn_img' && (
            <div className='max-w-fit size-full'>
              <MyImage
                className='object-contain size-full'
                src={`${leftCandidate.pathname}?w=1920&h=1760`}
                alt={leftCandidate.name}
              />
            </div>
          )}
          {picked !== 'right' && leftCandidate.mediaType === 'youtube' && (
            <div className='size-full flex items-center justify-center'>
              <iframe
                onClick={(e) => e.stopPropagation()}
                className='w-full h-[80%] max-h-full aspect-video'
                src={`https://www.youtube-nocookie.com/embed/${leftCandidate.pathname}`}
                title='Youtube video player'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                referrerPolicy='strict-origin-when-cross-origin'
                allowFullScreen
              />
            </div>
          )}
          {picked !== 'right' && leftCandidate.mediaType === 'chzzk' && (
            <div className='size-full flex items-center justify-center'>
              <iframe
                onClick={(e) => e.stopPropagation()}
                className='w-full h-[80%] max-h-full aspect-video'
                src={`https://chzzk.naver.com/embed/clip/${leftCandidate.pathname}`}
                title='CHZZK Player'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                referrerPolicy='strict-origin-when-cross-origin'
                allowFullScreen
              />
            </div>
          )}
          {!isFinished && picked !== 'right' && (
            <figcaption className='text-white absolute right-2/3 bottom-1/4 text-clamp font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>
              {leftCandidate.name}
            </figcaption>
          )}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute top-1/2 left-1/2 cursor-default -translate-x-1/2 -translate-y-1/2 text-primary-500 text-3clamp font-bold z-10 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] ${
              picked && 'hidden'
            }`}
          >
            VS
          </div>
        </figure>
        <figure
          onClick={() => {
            if (picked) return;
            handlePick('right');
          }}
          className={`w-1/2 cursor-pointer flex justify-start ${
            picked === 'left' && 'animate-shrinkLeft'
          } ${picked === 'right' && 'animate-expandRight'}`}
        >
          {picked !== 'left' && rightCandidate.mediaType === 'cdn_video' && (
            <video
              className='w-full h-full object-contain'
              autoPlay
              playsInline
              loop
              muted
            >
              <source
                src={`https://cdn.naepick.co.kr/${rightCandidate.pathname}`}
                type='video/mp4'
              />
            </video>
          )}
          {picked !== 'left' && rightCandidate.mediaType === 'cdn_img' && (
            <div className='max-w-fit size-full'>
              <MyImage
                className='object-contain size-full'
                src={`${rightCandidate.pathname}?w=1920&h=1760`}
                alt={rightCandidate.name}
              />
            </div>
          )}
          {picked !== 'left' && rightCandidate.mediaType === 'youtube' && (
            <div className='size-full flex items-center justify-center'>
              <iframe
                onClick={(e) => e.stopPropagation()}
                className='w-full h-[90%] max-h-full aspect-video'
                src={`https://www.youtube-nocookie.com/embed/${rightCandidate.pathname}`}
                title='Youtube video player'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                referrerPolicy='strict-origin-when-cross-origin'
                allowFullScreen
              />
            </div>
          )}
          {picked !== 'left' && rightCandidate.mediaType === 'chzzk' && (
            <div className='size-full flex items-center justify-center'>
              <iframe
                onClick={(e) => e.stopPropagation()}
                className='w-full h-[90%] max-h-full aspect-video'
                src={`https://chzzk.naver.com/embed/clip/${rightCandidate.pathname}`}
                title='CHZZK Player'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                referrerPolicy='strict-origin-when-cross-origin'
                allowFullScreen
              />
            </div>
          )}
          {!isFinished && picked !== 'left' && (
            <figcaption className='text-white absolute left-2/3 text-center bottom-1/4 text-clamp font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>
              {rightCandidate.name}
            </figcaption>
          )}
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
