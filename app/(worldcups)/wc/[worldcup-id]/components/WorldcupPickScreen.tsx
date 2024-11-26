'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { ArrowLeftFromLine, Maximize, Minimize } from 'lucide-react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { YouTubePlayer } from 'react-youtube';
import CandidateMedia from '@/app/components/CandidateMedia';
import { MatchStatus } from '@/app/constants';
import { delay } from '@/app/utils';
import { submitMatchResult as submitMatchResult } from '../actions';
import { useSavedWorldcupMatch } from '../hooks/useSavedWorldcupMatch';
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
  const { saveWorldcup, clearSavedWorldcup } = useSavedWorldcupMatch();
  const [leftYouTubePlayer, setLeftYouTubePlayer] = useState<YouTubePlayer | null>(null);
  const [rightYouTubePlayer, setRightYouTubePlayer] = useState<YouTubePlayer | null>(null);
  const fullScreenHandle = useFullScreenHandle();

  const [leftCandidate, rightCandidate] = [
    candidates[candidates.length - 2],
    candidates[candidates.length - 1],
  ];
  const round = candidates.length;
  const NEXT_ROUND_DELAY = 2000;

  const handlePick = async (target: MatchStatus.PICK_LEFT | MatchStatus.PICK_RIGHT) => {
    const winner = target === MatchStatus.PICK_LEFT ? leftCandidate : rightCandidate;
    const loser = target === MatchStatus.PICK_LEFT ? rightCandidate : leftCandidate;

    setMatchStatus(target);
    await delay(NEXT_ROUND_DELAY);

    const newCandidates = [winner, ...candidates.toSpliced(candidates.length - 2)];
    const newMatchResults = [...matchResult, { winnerId: winner.id, loserId: loser.id }];
    setCandidates(newCandidates);
    setBreakPoint(newCandidates, newMatchResults);
    saveWorldcup(newCandidates, newMatchResults);

    if (round === 2) {
      setMatchStatus(MatchStatus.END);
      setFinalWinnerCandidateId(winner.id);
      submitMatchResult(newMatchResults, worldcup.id);
      clearSavedWorldcup();
    } else {
      setMatchStatus(MatchStatus.IDLE);
      setMatchResult(newMatchResults);
    }
  };

  const handleGoBack = () => {
    goBack();
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
        {worldcup.title} {matchStatus === MatchStatus.END ? '종료!' : getRoundsDescription(round)}
      </h2>
      {matchStatus === MatchStatus.IDLE && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute inset-0 z-40 m-auto h-fit w-fit cursor-default text-2xl font-bold text-primary-700 drop-shadow-text lg:text-2clamp`}
        >
          VS
        </div>
      )}
      {matchStatus === MatchStatus.END && finalWinner ? (
        <div className="pointer-events-none absolute bottom-1 left-1/2 z-40 h-fit w-full -translate-x-1/2 lg:bottom-1/4">
          <h2 className="flex items-center justify-center text-xl font-bold text-primary-500 drop-shadow-text lg:text-clamp">
            {finalWinner.name} 우승!
          </h2>
        </div>
      ) : null}
      {leftCandidate && (
        <figure
          tabIndex={0}
          aria-label={`${leftCandidate.name}을 승자로 선택`}
          onMouseOver={handleOnMouseOverLeftYouTube}
          onClick={() => {
            if (matchStatus === MatchStatus.IDLE) handlePick(MatchStatus.PICK_LEFT);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (matchStatus === MatchStatus.IDLE) handlePick(MatchStatus.PICK_LEFT);
            }
          }}
          className={clsx(
            'group relative flex h-1/2 flex-col items-center justify-end focus:outline-2 focus:outline-primary-500 lg:h-full lg:w-1/2 lg:flex-row lg:justify-end',
            matchStatus === MatchStatus.PICK_LEFT && 'animate-mobileExpand lg:animate-expand',
            matchStatus === MatchStatus.PICK_RIGHT && 'invisible animate-mobileShrink lg:animate-shrink',
            matchStatus === MatchStatus.END && 'animate-mobileExpand lg:animate-expand',
          )}
        >
          <CandidateMedia
            key={leftCandidate.id}
            screenMode={matchStatus !== MatchStatus.END}
            path={leftCandidate.path}
            mediaType={leftCandidate.mediaType}
            name={leftCandidate.name}
            onYouTubePlay={(e) => setLeftYouTubePlayer(e.target)}
          />
          \
          {(matchStatus === MatchStatus.IDLE || matchStatus === MatchStatus.PICK_LEFT) && (
            <>
              {/* mobile */}
              <figcaption
                className={clsx(
                  'pointer-events-none absolute line-clamp-1 text-xl font-bold text-white drop-shadow-text transition-colors group-active:text-primary-600 lg:hidden',
                  matchStatus !== MatchStatus.PICK_LEFT && 'bottom-6',
                )}
              >
                {leftCandidate.name}
              </figcaption>
              {/* pc */}
              <figcaption
                className={clsx(
                  'pointer-events-none absolute bottom-1/4 line-clamp-1 hidden text-right text-5xl text-clamp font-bold text-white drop-shadow-text transition-colors group-hover:text-primary-500 group-active:text-primary-600 lg:block',
                  matchStatus === MatchStatus.PICK_LEFT ? 'right-1/2 translate-x-1/2' : 'right-[20%]',
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
          tabIndex={0}
          aria-label={`${rightCandidate.name}을 승자로 선택`}
          onMouseOver={handleOnMouseOverRightYouTube}
          onClick={() => {
            if (matchStatus === MatchStatus.IDLE) handlePick(MatchStatus.PICK_RIGHT);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (matchStatus === MatchStatus.IDLE) handlePick(MatchStatus.PICK_RIGHT);
            }
          }}
          className={clsx(
            'group relative flex h-1/2 flex-col items-center justify-start focus:outline-2 focus:outline-primary-500 lg:h-full lg:w-1/2 lg:flex-row lg:justify-start',
            matchStatus === MatchStatus.PICK_LEFT && 'invisible animate-mobileShrink lg:animate-shrink',
            matchStatus === MatchStatus.PICK_RIGHT && 'animate-mobileExpand lg:animate-expand',
            matchStatus === MatchStatus.END && 'animate-mobileExpand lg:animate-expand',
          )}
        >
          <CandidateMedia
            key={rightCandidate.id}
            screenMode={matchStatus !== MatchStatus.END}
            path={rightCandidate.path}
            mediaType={rightCandidate.mediaType}
            name={rightCandidate.name}
            onYouTubePlay={(e) => setRightYouTubePlayer(e.target)}
          />
          {(matchStatus === MatchStatus.IDLE || matchStatus === MatchStatus.PICK_RIGHT) && (
            <>
              {/* mobile */}
              <figcaption
                className={clsx(
                  'pointer-events-none absolute line-clamp-1 text-xl font-bold text-white drop-shadow-text transition-colors group-active:text-primary-600 lg:hidden',
                  matchStatus !== MatchStatus.PICK_RIGHT && 'top-6',
                )}
              >
                {rightCandidate.name}
              </figcaption>
              {/* pc */}
              <figcaption
                className={clsx(
                  'pointer-events-none absolute bottom-1/4 line-clamp-1 hidden text-5xl text-clamp font-bold text-white drop-shadow-text transition-colors group-hover:text-primary-500 group-active:text-primary-600 lg:block',
                  matchStatus === MatchStatus.PICK_RIGHT ? 'left-1/2 -translate-x-1/2' : 'left-[20%]',
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
            canGoBack && matchStatus === MatchStatus.IDLE
              ? 'transition-colors hover:bg-white/30'
              : 'opacity-20',
          )}
          disabled={!canGoBack || matchStatus !== MatchStatus.IDLE}
          onClick={() => {
            if (canGoBack && matchStatus === MatchStatus.IDLE) handleGoBack();
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
