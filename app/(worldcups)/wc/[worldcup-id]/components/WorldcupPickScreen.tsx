'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { Fullscreen, Maximize, Minimize } from 'lucide-react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { YouTubePlayer } from 'react-youtube';
import CandidateMedia from '@/app/components/CandidateMedia';
import Button from '@/app/ui/Button';
import { delay } from '@/app/utils';
import { submitMatchResult as submitMatchResult } from '../actions';
import { useWorldcupMatch } from '../hooks/useWorldcupMatch';
import { getRoundsDescription } from '../utils';

interface Props {
  className: string;
}

export default function WorldcupPickScreen({ className }: Props) {
  const {
    worldcup,
    matchStatus,
    setMatchStatus,
    candidates,
    setCandidates,
    matchResult,
    setMatchResult,
    setFinalWinnerCandidateId,
    finalWinner,
  } = useWorldcupMatch();
  const [leftYouTubePlayer, setLeftYouTubePlayer] = useState<YouTubePlayer | null>(null);
  const [rightYouTubePlayer, setRightYouTubePlayer] = useState<YouTubePlayer | null>(null);
  const fullScreenHandle = useFullScreenHandle();

  const [leftCandidate, rightCandidate] = [
    candidates[candidates.length - 2],
    candidates[candidates.length - 1],
  ];
  const round = candidates.length;
  const NEXT_ROUND_DELAY = 2000;

  const handlePick = async (target: 'PICK_LEFT' | 'PICK_RIGHT') => {
    const winner = target === 'PICK_LEFT' ? leftCandidate : rightCandidate;
    const loser = target === 'PICK_LEFT' ? rightCandidate : leftCandidate;

    setMatchStatus(target);
    await delay(NEXT_ROUND_DELAY);
    const newCandidates = [winner, ...candidates.toSpliced(candidates.length - 2)];
    setCandidates(newCandidates);
    if (round === 2) {
      setMatchStatus('END');
      setFinalWinnerCandidateId(winner.id);
      const matchResults = [...matchResult, { winnerId: winner.id, loserId: loser.id }];
      submitMatchResult(matchResults, worldcup.id);
    } else {
      setMatchStatus('IDLE');
      setMatchResult([...matchResult, { winnerId: winner.id, loserId: loser.id }]);
    }
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
    <FullScreen handle={fullScreenHandle}>
      <section className={clsx('relative flex flex-col bg-black lg:flex-row', className)}>
        <h2
          className={clsx(
            'pointer-events-none absolute z-40 w-full bg-black/50 text-center text-xl font-bold text-white lg:text-5xl',
            fullScreenHandle.active && 'top-8 lg:top-20',
          )}
        >
          {worldcup.title} {getRoundsDescription(round)}
        </h2>
        {matchStatus === 'IDLE' && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`drop-shadow-text absolute inset-0 z-40 m-auto h-fit w-fit cursor-default text-3clamp font-bold text-primary-700`}
          >
            VS
          </div>
        )}
        {matchStatus === 'END' && finalWinner ? (
          <div className="pointer-events-none absolute bottom-1 left-1/2 z-40 h-fit w-full -translate-x-1/2 lg:bottom-1/4">
            <h2 className="drop-shadow-text flex items-center justify-center text-xl font-bold text-primary-500 lg:text-clamp">
              {finalWinner.name} 우승!
            </h2>
          </div>
        ) : null}
        {leftCandidate && (
          <figure
            onMouseOver={handleOnMouseOverLeftYouTube}
            onClick={() => {
              if (matchStatus !== 'IDLE') return;
              handlePick('PICK_LEFT');
            }}
            className={clsx(
              'group relative flex h-1/2 flex-col items-center justify-end lg:h-full lg:w-1/2 lg:flex-row lg:justify-end',
              matchStatus === 'PICK_LEFT' && 'animate-mobileExpandTop lg:animate-expandLeft',
              matchStatus === 'PICK_RIGHT' && 'animate-mobileShrinkTop lg:animate-shrinkRight',
              matchStatus === 'END' && 'animate-mobileExpandTop lg:animate-expandLeft',
            )}
          >
            <CandidateMedia
              key={leftCandidate.id}
              screenMode={matchStatus === 'END' ? false : true}
              path={leftCandidate.path}
              mediaType={leftCandidate.mediaType}
              name={leftCandidate.name}
              onYouTubePlay={(e) => setLeftYouTubePlayer(e.target)}
            />
            \
            {(matchStatus === 'IDLE' || matchStatus === 'PICK_LEFT') && (
              <>
                {/* mobile */}
                <figcaption
                  className={clsx(
                    'drop-shadow-text pointer-events-none absolute line-clamp-1 text-3xl font-bold text-white transition-colors group-active:text-primary-600 lg:hidden',
                    matchStatus !== 'PICK_LEFT' && 'bottom-6',
                  )}
                >
                  {leftCandidate.name}
                </figcaption>
                {/* pc */}
                <figcaption
                  className={clsx(
                    'drop-shadow-text pointer-events-none absolute bottom-1/4 line-clamp-1 hidden text-right text-5xl text-clamp font-bold text-white transition-colors group-hover:text-primary-500 group-active:text-primary-600 lg:block',
                    matchStatus === 'PICK_LEFT' ? 'right-1/2 translate-x-1/2' : 'right-[20%]',
                  )}
                >
                  {leftCandidate.name}
                </figcaption>
              </>
            )}
          </figure>
        )}
        {rightCandidate && (
          <figure
            onMouseOver={handleOnMouseOverRightYouTube}
            onClick={() => {
              if (matchStatus !== 'IDLE') return;
              handlePick('PICK_RIGHT');
            }}
            className={clsx(
              'group relative flex h-1/2 flex-col items-center justify-start lg:h-full lg:w-1/2 lg:flex-row lg:justify-start',
              matchStatus === 'PICK_LEFT' && 'animate-mobileShrinkBottom lg:animate-shrinkLeft',
              matchStatus === 'PICK_RIGHT' && 'animate-mobileExpandBottom lg:animate-expandRight',
              matchStatus === 'END' && 'animate-mobileExpandBottom lg:animate-expandRight',
            )}
          >
            <CandidateMedia
              key={rightCandidate.id}
              screenMode={matchStatus === 'END' ? false : true}
              path={rightCandidate.path}
              mediaType={rightCandidate.mediaType}
              name={rightCandidate.name}
              onYouTubePlay={(e) => setRightYouTubePlayer(e.target)}
            />
            {(matchStatus === 'IDLE' || matchStatus === 'PICK_RIGHT') && (
              <>
                {/* mobile */}
                <figcaption
                  className={clsx(
                    'drop-shadow-text pointer-events-none absolute line-clamp-1 text-3xl font-bold text-white transition-colors group-active:text-primary-600 lg:hidden',
                    matchStatus !== 'PICK_RIGHT' && 'top-6',
                  )}
                >
                  {rightCandidate.name}
                </figcaption>
                {/* pc */}
                <figcaption
                  className={clsx(
                    'drop-shadow-text pointer-events-none absolute bottom-1/4 line-clamp-1 hidden text-5xl text-clamp font-bold text-white transition-colors group-hover:text-primary-500 group-active:text-primary-600 lg:block',
                    matchStatus === 'PICK_RIGHT' ? 'left-1/2 -translate-x-1/2' : 'left-[20%]',
                  )}
                >
                  {rightCandidate.name}
                </figcaption>
              </>
            )}
          </figure>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (fullScreenHandle.active) {
              fullScreenHandle.exit();
            } else {
              fullScreenHandle.enter();
            }
          }}
          className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full text-gray-300 transition-colors hover:bg-white/30 lg:right-5"
          aria-label="전체화면"
          title="전체화면"
        >
          {fullScreenHandle.active ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
        </button>
      </section>
    </FullScreen>
  );
}
