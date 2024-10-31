'use client';

import { submitMatchResult } from '@/app/lib/actions/statistics/create-match-result';
import { Candidate, MatchResult, Worldcup } from '@/app/lib/definitions';
import { useRef, useState } from 'react';
import ResponsiveMedia from '../media/responsive-media';
import YouTube, { YouTubePlayer } from 'react-youtube';

interface Props {
  defaultCandidates: Candidate[];
  worldcup: Worldcup;
  startingRound: number;
  onWorldcupEnd: () => void;
  className: string;
}

export default function WorldcupPickScreen({
  defaultCandidates,
  worldcup,
  startingRound,
  onWorldcupEnd,
  className,
}: Props) {
  const [candidates, setCandidates] = useState<Candidate[]>(
    defaultCandidates.slice(0, startingRound)
  );
  const [matchResult, setMatchResult] = useState<MatchResult[]>([]);
  const [picked, setPicked] = useState<'left' | 'right'>();
  const leftYoutubeRef = useRef<YouTube | null>(null);
  const rightYoutubeRef = useRef<YouTube | null>(null);
  const [leftYouTubePlayer, setLeftYouTubePlayer] =
    useState<YouTubePlayer | null>(null);
  const [rightYouTubePlayer, setRightYouTubePlayer] =
    useState<YouTubePlayer | null>(null);

  const round = candidates.length;
  const [leftIndex, rightIndex] = [round - 2, round - 1];
  const [leftCandidate, rightCandidate] = [
    candidates[leftIndex],
    candidates[rightIndex],
  ];
  const isFinished = round === 2 && picked;

  const handlePick = async (target: 'left' | 'right') => {
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
      await submitMatchResult(matchResultToSubmit, worldcup.worldcupId);
      onWorldcupEnd();
      return;
    }

    setTimeout(() => {
      const newCandidates = [winner, ...candidates.toSpliced(leftIndex)];
      setCandidates(newCandidates);
      setMatchResult([...matchResult, { winnerCandidateId, loserCandidateId }]);
      setPicked(undefined);
    }, 2000);
  };

  const handleOnMouseOverLeftYouTube = () => {
    if (rightYouTubePlayer) rightYouTubePlayer.mute();
    if (leftYouTubePlayer) leftYouTubePlayer.unMute();
  };

  const handleOnMouseOverRightYouTube = () => {
    if (leftYouTubePlayer) leftYouTubePlayer.mute();
    if (rightYouTubePlayer) rightYouTubePlayer.unMute();
  };

  return (
    <>
      <section
        className={`relative flex bg-black h-[calc(100vh-62px)] ${className}`}
      >
        <div className='absolute left-1/2 -translate-x-1/2 bg-black bg-opacity-30 z-50 w-full'>
          <h2 className='text-center text-white text-2clamp font-bold'>
            {worldcup.title} {getRoundsDescription(round)}
          </h2>
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute inset-0 m-auto w-fit h-fit cursor-default text-primary-500 text-3clamp font-bold z-50 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] ${
            picked ? 'hidden' : ''
          }`}
        >
          VS
        </div>

        {isFinished ? (
          <div className='absolute left-1/2 bottom-1/4 -translate-x-1/2 bg-black bg-opacity-30 z-50 w-full'>
            <h2 className='flex justify-center items-center text-white text-2clamp font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>
              {picked === 'left'
                ? candidates[leftIndex].name
                : candidates[rightIndex].name}{' '}
              우승!
            </h2>
          </div>
        ) : null}
        <figure
          onMouseOver={handleOnMouseOverLeftYouTube}
          onClick={() => {
            if (picked) return;
            handlePick('left');
          }}
          className={`w-1/2 relative cursor-pointer flex justify-end ${
            picked === 'left' ? 'animate-expandLeft' : ''
          } ${picked === 'right' ? 'animate-shrinkRight' : ''}`}
        >
          {picked !== 'right' ? (
            <ResponsiveMedia
              lowerHeight={true}
              pathname={leftCandidate.pathname}
              mediaType={leftCandidate.mediaType}
              name={leftCandidate.name}
              ref={leftYoutubeRef}
              onYouTubePlay={(e) => setLeftYouTubePlayer(e.target)}
            />
          ) : null}
          {!isFinished && picked !== 'right' && (
            <figcaption
              className={`${
                picked ? 'right-1/2' : 'right-[20%]'
              } text-white min-h-24 absolute text-right bottom-1/4 text-clamp font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]`}
            >
              {leftCandidate.name}
            </figcaption>
          )}
        </figure>
        <figure
          onMouseOver={handleOnMouseOverRightYouTube}
          onClick={() => {
            if (picked) return;
            handlePick('right');
          }}
          className={`w-1/2 relative cursor-pointer flex justify-start ${
            picked === 'left' ? 'animate-shrinkLeft' : ''
          } ${picked === 'right' ? 'animate-expandRight' : ''}`}
        >
          {picked !== 'left' ? (
            <ResponsiveMedia
              lowerHeight={true}
              pathname={rightCandidate.pathname}
              mediaType={rightCandidate.mediaType}
              name={rightCandidate.name}
              ref={rightYoutubeRef}
              onYouTubePlay={(e) => setRightYouTubePlayer(e.target)}
            />
          ) : null}
          {!isFinished && picked !== 'left' ? (
            <figcaption
              className={`${
                picked ? 'left-1/2' : 'left-[20%]'
              } text-white min-h-24 absolute text-left bottom-1/4 text-clamp font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]`}
            >
              {rightCandidate.name}
            </figcaption>
          ) : null}
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
