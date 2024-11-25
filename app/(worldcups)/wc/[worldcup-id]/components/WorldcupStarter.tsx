'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { ChartNoAxesColumnDecreasing, RotateCcw, Share } from 'lucide-react';
import dynamic from 'next/dynamic';
import WorldcupFold from '@/app/(worldcups)/wc/[worldcup-id]/components/WorldcupFold';
import ShareWorldcupModal from '@/app/components/Modal/ShareWorldcupModal';
import { MatchStatus, MIN_NUMBER_OF_CANDIDATES } from '@/app/constants';
import Button from '@/app/ui/Button';
import LinkButton from '@/app/ui/LinkButton';
import CommentSection from './CommentSection';
import WorldcupPickScreen from './WorldcupPickScreen';
import { useWorldcupMatch } from '../hooks/useWorldcupMatch';

export default function WorldcupStarter() {
  const { worldcup, userId, matchStatus, setMatchStatus, finalWinnerCandidateId } = useWorldcupMatch();
  const [shareWorldcupModal, setShareWorldcupModal] = useState(false);
  const WorldcupStarterModal = useMemo(
    () => dynamic(() => import('./WorldcupStarterModal'), { ssr: false }),
    [],
  );
  const notEnoughCandidates = worldcup.candidatesCount < MIN_NUMBER_OF_CANDIDATES;

  if (matchStatus === MatchStatus.SELECTING_ROUNDS) {
    return (
      <>
        <section className="relative flex h-full flex-grow bg-black">
          <h1 className="pointer-events-none absolute z-40 w-full bg-black/50 text-center text-xl font-bold text-white lg:text-5xl">
            {worldcup.title}{' '}
            {notEnoughCandidates ? (
              <>
                <br />
                준비 중인 이상형 월드컵입니다.
              </>
            ) : (
              <>
                <br />곧 시작됩니다!
              </>
            )}
          </h1>
          <WorldcupStarterModal open={matchStatus === MatchStatus.SELECTING_ROUNDS} />
        </section>
      </>
    );
  }

  const handleWorldcupRestart = () => {
    setMatchStatus(MatchStatus.SELECTING_ROUNDS);
  };

  return (
    <div className="flex h-[calc(100svh-52px)] flex-col bg-black/95 lg:flex-grow lg:flex-row">
      <WorldcupPickScreen
        className={clsx(
          'h-[calc(100svh-52px)] lg:flex-1',
          matchStatus === MatchStatus.END ? 'h-[calc(30svh-52px)] lg:h-[calc(100svh-52px)]' : 'lg:h-full',
        )}
      />
      {matchStatus === MatchStatus.END && (
        <div className="h-[calc(70svh)] overflow-y-scroll bg-white p-3 lg:h-full lg:w-[31rem] lg:p-8">
          <section>
            <div className="mb-4 flex gap-1">
              <LinkButton
                href={`/wc/${worldcup.id}/stats`}
                className="w-full text-sm lg:text-base"
                variant="primary"
                size="sm"
              >
                <ChartNoAxesColumnDecreasing size="1.2rem" color="#FFFFFF" />
                랭킹 보기
              </LinkButton>
              <Button
                className="w-full text-sm lg:text-base"
                variant="outline"
                size="sm"
                onClick={() => setShareWorldcupModal(true)}
              >
                <Share color="#000000" size="1.2rem" />
                공유 하기
              </Button>
              <Button
                onClick={handleWorldcupRestart}
                variant="ghost"
                size="sm"
                className="w-full text-sm lg:text-base"
              >
                <RotateCcw color="#334155" size="1.2rem" />
                다시 하기
              </Button>
            </div>
            <WorldcupFold
              nickname={worldcup.nickname}
              createdAt={worldcup.createdAt}
              updatedAt={worldcup.updatedAt}
              description={worldcup.description}
              profilePath={worldcup.profilePath}
              worldcupId={worldcup.id}
              userId={userId}
            />
          </section>
          <CommentSection
            worldcupId={worldcup.id}
            finalWinnerCandidateId={finalWinnerCandidateId}
            userId={userId}
          />
        </div>
      )}
      <ShareWorldcupModal
        open={shareWorldcupModal}
        onClose={() => setShareWorldcupModal(false)}
        title={worldcup.title}
        worldcupId={worldcup.id}
      />
    </div>
  );
}
