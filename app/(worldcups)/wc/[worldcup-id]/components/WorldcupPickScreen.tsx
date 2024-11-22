'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { ArrowLeftFromLine, Maximize, Minimize } from 'lucide-react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { YouTubePlayer } from 'react-youtube';
import CandidateMedia from '@/app/components/CandidateMedia';
import { MATCH_STATUS } from '@/app/constants';
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
    setBreakPoint,
    goBack,
    canGoBack,
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

  const handlePick = async (target: MATCH_STATUS.PICK_LEFT | MATCH_STATUS.PICK_RIGHT) => {
    const winner = target === MATCH_STATUS.PICK_LEFT ? leftCandidate : rightCandidate;
    const loser = target === MATCH_STATUS.PICK_LEFT ? rightCandidate : leftCandidate;

    setMatchStatus(target);
    await delay(NEXT_ROUND_DELAY);

    const newCandidates = [winner, ...candidates.toSpliced(candidates.length - 2)];
    const newMatchResults = [...matchResult, { winnerId: winner.id, loserId: loser.id }];
    setCandidates(newCandidates);
    setBreakPoint(newCandidates, newMatchResults);

    if (round === 2) {
      setMatchStatus(MATCH_STATUS.END);
      setFinalWinnerCandidateId(winner.id);
      submitMatchResult(newMatchResults, worldcup.id);
    } else {
      setMatchStatus(MATCH_STATUS.IDLE);
      setMatchResult(newMatchResults);
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
    <FullScreen
      handle={fullScreenHandle}
      className={clsx('relative flex flex-col bg-black lg:flex-row', className)}
    >
      <h2
        className={clsx(
          'pointer-events-none absolute z-40 w-full bg-black/50 text-center text-xl font-bold text-white lg:text-5xl',
          fullScreenHandle.active && 'top-8 lg:top-20',
        )}
      >
        {worldcup.title} {matchStatus === MATCH_STATUS.END ? '종료!' : getRoundsDescription(round)}
      </h2>
      {matchStatus === MATCH_STATUS.IDLE && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute inset-0 z-40 m-auto h-fit w-fit cursor-default text-3clamp font-bold text-primary-700 drop-shadow-text`}
        >
          VS
        </div>
      )}
      {matchStatus === MATCH_STATUS.END && finalWinner ? (
        <div className="pointer-events-none absolute bottom-1 left-1/2 z-40 h-fit w-full -translate-x-1/2 lg:bottom-1/4">
          <h2 className="flex items-center justify-center text-xl font-bold text-primary-500 drop-shadow-text lg:text-clamp">
            {finalWinner.name} 우승!
          </h2>
        </div>
      ) : null}
      {leftCandidate && (
        <figure
          onMouseOver={handleOnMouseOverLeftYouTube}
          onClick={() => {
            if (matchStatus !== MATCH_STATUS.IDLE) return;
            handlePick(MATCH_STATUS.PICK_LEFT);
          }}
          className={clsx(
            'group relative flex h-1/2 flex-col items-center justify-end lg:h-full lg:w-1/2 lg:flex-row lg:justify-end',
            matchStatus === MATCH_STATUS.PICK_LEFT && 'animate-mobileExpand lg:animate-expand',
            matchStatus === MATCH_STATUS.PICK_RIGHT && 'animate-mobileShrink lg:animate-shrink invisible',
            matchStatus === MATCH_STATUS.END && 'animate-mobileExpand lg:animate-expand',
          )}
        >
          <CandidateMedia
            key={leftCandidate.id}
            screenMode={matchStatus !== MATCH_STATUS.END}
            path={leftCandidate.path}
            mediaType={leftCandidate.mediaType}
            name={leftCandidate.name}
            onYouTubePlay={(e) => setLeftYouTubePlayer(e.target)}
          />
          \
          {(matchStatus === MATCH_STATUS.IDLE || matchStatus === MATCH_STATUS.PICK_LEFT) && (
            <>
              {/* mobile */}
              <figcaption
                className={clsx(
                  'pointer-events-none absolute line-clamp-1 text-3xl font-bold text-white drop-shadow-text transition-colors group-active:text-primary-600 lg:hidden',
                  matchStatus !== MATCH_STATUS.PICK_LEFT && 'bottom-6',
                )}
              >
                {leftCandidate.name}
              </figcaption>
              {/* pc */}
              <figcaption
                className={clsx(
                  'pointer-events-none absolute bottom-1/4 line-clamp-1 hidden text-right text-5xl text-clamp font-bold text-white drop-shadow-text transition-colors group-hover:text-primary-500 group-active:text-primary-600 lg:block',
                  matchStatus === MATCH_STATUS.PICK_LEFT ? 'right-1/2 translate-x-1/2' : 'right-[20%]',
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
            if (matchStatus !== MATCH_STATUS.IDLE) return;
            handlePick(MATCH_STATUS.PICK_RIGHT);
          }}
          className={clsx(
            'group relative flex h-1/2 flex-col items-center justify-start lg:h-full lg:w-1/2 lg:flex-row lg:justify-start',
            matchStatus === MATCH_STATUS.PICK_LEFT && 'animate-mobileShrink lg:animate-shrink invisible',
            matchStatus === MATCH_STATUS.PICK_RIGHT && 'animate-mobileExpand lg:animate-expand',
            matchStatus === MATCH_STATUS.END && 'animate-mobileExpand lg:animate-expand',
          )}
        >
          <CandidateMedia
            key={rightCandidate.id}
            screenMode={matchStatus !== MATCH_STATUS.END}
            path={rightCandidate.path}
            mediaType={rightCandidate.mediaType}
            name={rightCandidate.name}
            onYouTubePlay={(e) => setRightYouTubePlayer(e.target)}
          />
          {(matchStatus === MATCH_STATUS.IDLE || matchStatus === MATCH_STATUS.PICK_RIGHT) && (
            <>
              {/* mobile */}
              <figcaption
                className={clsx(
                  'pointer-events-none absolute line-clamp-1 text-3xl font-bold text-white drop-shadow-text transition-colors group-active:text-primary-600 lg:hidden',
                  matchStatus !== MATCH_STATUS.PICK_RIGHT && 'top-6',
                )}
              >
                {rightCandidate.name}
              </figcaption>
              {/* pc */}
              <figcaption
                className={clsx(
                  'pointer-events-none absolute bottom-1/4 line-clamp-1 hidden text-5xl text-clamp font-bold text-white drop-shadow-text transition-colors group-hover:text-primary-500 group-active:text-primary-600 lg:block',
                  matchStatus === MATCH_STATUS.PICK_RIGHT ? 'left-1/2 -translate-x-1/2' : 'left-[20%]',
                )}
              >
                {rightCandidate.name}
              </figcaption>
            </>
          )}
        </figure>
      )}
      <div className="absolute bottom-2 right-2 flex items-center gap-2 lg:right-5">
        <button
          aria-label="취소"
          title="취소"
          className={clsx(
            'flex h-10 w-10 items-center justify-center rounded-full text-white/80',
            canGoBack && matchStatus === MATCH_STATUS.IDLE
              ? 'transition-colors hover:bg-white/30'
              : 'opacity-20',
          )}
          disabled={!canGoBack || matchStatus !== MATCH_STATUS.IDLE}
          onClick={() => {
            if (canGoBack && matchStatus === MATCH_STATUS.IDLE) goBack();
          }}
        >
          <ArrowLeftFromLine className="h-6 w-6" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (fullScreenHandle.active) {
              fullScreenHandle.exit();
            } else {
              fullScreenHandle.enter();
            }
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/30"
          aria-label="전체화면"
          title="전체화면"
        >
          {fullScreenHandle.active ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
        </button>
      </div>
    </FullScreen>
  );
}
