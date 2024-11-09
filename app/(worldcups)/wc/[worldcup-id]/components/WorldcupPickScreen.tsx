'use client';

import Media from '@/app/components/media';
import { Candidate, MatchResult, Worldcup } from '@/app/lib/types';
import { useState } from 'react';
import { YouTubePlayer } from 'react-youtube';
import { InferSelectModel } from 'drizzle-orm';
import { candidates, worldcups } from '@/app/lib/database/schema';
import { getRoundsDescription } from '../utils';
import { submitGameResult as submitGameResult } from '../actions';

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
  const [gameResult, setGameResult] = useState<{ winnerId: string; loserId: string }[]>([]);
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
      const gameResults = [...gameResult, { winnerId, loserId }];
      await submitGameResult(gameResults, worldcup.id);
      onWorldcupEnd(winnerId);
      return;
    }

    setTimeout(() => {
      const newCandidates = [winner, ...candidates.toSpliced(leftIndex)];
      setCandidates(newCandidates);
      setGameResult([...gameResult, { winnerId, loserId }]);
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
      <section className={`relative flex bg-black h-[calc(100vh-68px)] ${className}`}>
        <h2 className="absolute bg-black/50 z-50 w-full text-center text-white text-2clamp font-bold pointer-events-none">
          {worldcup.title} {getRoundsDescription(round)}
        </h2>
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute inset-0 m-auto w-fit h-fit cursor-default text-primary-300 text-3clamp font-bold z-50 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] ${
            picked ? 'hidden' : ''
          }`}
        >
          VS
        </div>

        {isFinished ? (
          <div className="pointer-events-none absolute left-1/2 bottom-1/4 -translate-x-1/2 bg-black bg-opacity-30 z-50 w-full">
            <h2 className="flex justify-center items-center text-white text-2clamp font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
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
          className={`group h-full w-1/2 relative flex justify-end ${
            picked === 'left' ? 'animate-expandLeft' : ''
          } ${picked === 'right' ? 'animate-shrinkRight' : ''}`}
        >
          {picked !== 'right' ? (
            <Media
              lowerHeight={isFinished ? false : true}
              path={leftCandidate.path}
              mediaType={leftCandidate.mediaType}
              name={leftCandidate.name}
              onYouTubePlay={(e) => setLeftYouTubePlayer(e.target)}
            />
          ) : null}
          {!isFinished && picked !== 'right' && (
            <figcaption
              className={`${
                picked ? 'right-1/2' : 'right-[20%]'
              } pointer-events-none group-hover:text-primary-300 group-active:text-primary-500 transition-colors text-white min-h-24 absolute text-right bottom-1/4 text-clamp font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]`}
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
          className={`group h-full w-1/2 relative cursor-pointer flex justify-start ${
            picked === 'left' ? 'animate-shrinkLeft' : ''
          } ${picked === 'right' ? 'animate-expandRight' : ''}`}
        >
          {picked !== 'left' ? (
            <Media
              lowerHeight={isFinished ? false : true}
              path={rightCandidate.path}
              mediaType={rightCandidate.mediaType}
              name={rightCandidate.name}
              onYouTubePlay={(e) => setRightYouTubePlayer(e.target)}
            />
          ) : null}
          {!isFinished && picked !== 'left' ? (
            <figcaption
              className={`${
                picked ? 'left-1/2' : 'left-[20%]'
              } pointer-events-none group-hover:text-primary-300 group-active:text-primary-500 transition-colors text-white min-h-24 absolute text-left bottom-1/4 text-clamp font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]`}
            >
              {rightCandidate.name}
            </figcaption>
          ) : null}
        </figure>
      </section>
    </>
  );
}
