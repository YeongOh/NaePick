'use client';

import Media from '@/app/components/media';
import { useState } from 'react';
import { YouTubePlayer } from 'react-youtube';
import { InferSelectModel } from 'drizzle-orm';
import { candidates, worldcups } from '@/app/lib/database/schema';
import { getRoundsDescription } from '../utils';
import { submitMatchResult as submitMatchResult } from '../actions';

type CandidateModel = InferSelectModel<typeof candidates> & { mediaType: string };
type WorldcupModel = InferSelectModel<typeof worldcups> & {
  candidatesCount: number;
  profilePath: string | null;
  nickname: string | null;
};

interface Props {
  defaultCandidates: CandidateModel[];
  worldcup: WorldcupModel;
  startingRound: number;
  onWorldcupEnd: (finalWinnerCandidateId: string) => void;
  className: string;
}

export default function WorldcupPickScreen({
  defaultCandidates,
  worldcup,
  startingRound,
  onWorldcupEnd,
  className,
}: Props) {
  const [candidates, setCandidates] = useState<CandidateModel[]>(defaultCandidates.slice(0, startingRound));
  const [matchResult, setMatchResult] = useState<{ winnerId: string; loserId: string }[]>([]);
  const [picked, setPicked] = useState<'left' | 'right'>();
  const [leftYouTubePlayer, setLeftYouTubePlayer] = useState<YouTubePlayer | null>(null);
  const [rightYouTubePlayer, setRightYouTubePlayer] = useState<YouTubePlayer | null>(null);

  const round = candidates.length;
  const [leftIndex, rightIndex] = [round - 2, round - 1];
  const [leftCandidate, rightCandidate] = [candidates[leftIndex], candidates[rightIndex]];
  const isFinished = round === 2 && picked;

  const handlePick = async (target: 'left' | 'right') => {
    const winner = target === 'left' ? leftCandidate : rightCandidate;
    const loser = target === 'left' ? rightCandidate : leftCandidate;
    const winnerId = winner.id;
    const loserId = loser.id;
    setPicked(target);

    if (round == 2) {
      const matchResults = [...matchResult, { winnerId, loserId }];
      await submitMatchResult(matchResults, worldcup.id);
      onWorldcupEnd(winnerId);
      return;
    }

    setTimeout(() => {
      const newCandidates = [winner, ...candidates.toSpliced(leftIndex)];
      setCandidates(newCandidates);
      setMatchResult([...matchResult, { winnerId, loserId }]);
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
      <section className={`relative flex flex-col bg-black lg:flex-row ${className}`}>
        <h2 className="pointer-events-none absolute z-40 w-full bg-black/50 text-center text-3xl font-bold leading-10 text-white lg:text-2clamp">
          {worldcup.title} {getRoundsDescription(round)}
        </h2>
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute inset-0 z-40 m-auto h-fit w-fit cursor-default text-3clamp font-bold text-primary-700 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] ${
            picked ? 'hidden' : ''
          }`}
        >
          VS
        </div>

        {isFinished ? (
          <div className="pointer-events-none absolute bottom-1 left-1/2 z-40 h-fit w-full -translate-x-1/2 bg-black bg-opacity-30 lg:bottom-1/4">
            <h2 className="flex items-center justify-center text-2xl font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] lg:text-3xl">
              {picked === 'left' ? candidates[leftIndex].name : candidates[rightIndex].name} 우승!
            </h2>
          </div>
        ) : null}
        <figure
          onMouseOver={handleOnMouseOverLeftYouTube}
          onClick={() => {
            if (picked) return;
            handlePick('left');
          }}
          className={`group relative flex h-1/2 flex-col items-center justify-end lg:h-full lg:w-1/2 lg:flex-row lg:justify-end ${
            picked === 'left' ? 'animate-mobileExpandTop lg:animate-expandLeft' : ''
          } ${picked === 'right' ? 'animate-mobileShrinkTop lg:animate-shrinkRight' : ''}`}
        >
          {picked !== 'right' ? (
            <Media
              screenMode={isFinished ? false : true}
              path={leftCandidate.path}
              mediaType={leftCandidate.mediaType}
              name={leftCandidate.name}
              onYouTubePlay={(e) => setLeftYouTubePlayer(e.target)}
            />
          ) : null}
          {!isFinished && picked !== 'right' && (
            <figcaption
              className={`${
                picked ? 'right-1/2 translate-x-1/2' : 'bottom-6 lg:right-[20%]'
              } pointer-events-none absolute line-clamp-1 w-3/4 text-right text-3xl font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] transition-colors group-hover:text-primary-500 group-active:text-primary-600 lg:bottom-1/4 lg:w-4/5 lg:text-clamp`}
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
          className={`group relative flex h-1/2 flex-col items-center justify-start lg:h-full lg:w-1/2 lg:flex-row lg:justify-start ${
            picked === 'left' ? 'animate-mobileShrinkBottom lg:animate-shrinkLeft' : ''
          } ${picked === 'right' ? 'animate-mobileExpandBottom lg:animate-expandRight' : ''}`}
        >
          {picked !== 'left' ? (
            <Media
              screenMode={isFinished ? false : true}
              path={rightCandidate.path}
              mediaType={rightCandidate.mediaType}
              name={rightCandidate.name}
              onYouTubePlay={(e) => setRightYouTubePlayer(e.target)}
            />
          ) : null}
          {!isFinished && picked !== 'left' ? (
            <figcaption
              className={`${
                picked ? 'lg:left-1/2 lg:-translate-x-1/2' : 'top-6 lg:left-[20%]'
              } pointer-events-none absolute line-clamp-1 w-3/4 text-3xl font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] transition-colors group-hover:text-primary-500 group-active:text-primary-600 lg:bottom-1/4 lg:top-auto lg:w-4/5 lg:text-clamp`}
            >
              {rightCandidate.name}
            </figcaption>
          ) : null}
        </figure>
      </section>
    </>
  );
}
