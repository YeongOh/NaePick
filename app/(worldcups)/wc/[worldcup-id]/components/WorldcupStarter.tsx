'use client';

import { useMemo, useState } from 'react';
import { MIN_NUMBER_OF_CANDIDATES } from '@/app/constants';
import { ChartNoAxesColumnDecreasing, RotateCcw, Share } from 'lucide-react';
import WorldcupPickScreen from './WorldcupPickScreen';
import WorldcupFold from '@/app/(worldcups)/wc/[worldcup-id]/components/WorldcupFold';
import LinkButton from '@/app/components/ui/link-button';
import Button from '@/app/components/ui/button';
import ShareWorldcupModal from '@/app/components/modal/share-worldcup-modal';
import CommentSection from './CommentSection';
import { getRandomCandidates } from '../actions';
import { InferSelectModel } from 'drizzle-orm';
import { candidates, worldcups } from '@/app/lib/database/schema';
import dynamic from 'next/dynamic';

type CandidateModel = InferSelectModel<typeof candidates> & { mediaType: string };

type WorldcupModel = InferSelectModel<typeof worldcups> & {
  candidatesCount: number;
  profilePath: string | null;
  nickname: string | null;
};

interface Props {
  worldcup: WorldcupModel;
  userId?: string;
}

export default function WorldcupStarter({ worldcup, userId }: Props) {
  const [isSelectingRounds, setIsSelectingRounds] = useState<boolean>(true);
  const [candidates, setCandidates] = useState<CandidateModel[]>([]);
  const [round, setRounds] = useState<number | null>(null);
  const [openStartWorldcupModal, setOpenStartWorldcupModal] = useState<boolean>(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [shareWorldcupModal, setShareWorldcupModal] = useState(false);
  const [finalWinnerCandidateId, setFinalWinnerCandidateId] = useState<string>();
  const WorldcupStarterModal = useMemo(
    () => dynamic(() => import('./WorldcupStarterModal'), { ssr: false }),
    []
  );

  const notEnoughCandidates = (worldcup.candidatesCount as number) < MIN_NUMBER_OF_CANDIDATES;

  const handleRoundSumbit = async (selectedRound: number) => {
    setOpenStartWorldcupModal(false);
    const randomCandidates = await getRandomCandidates(worldcup.id, selectedRound);
    setCandidates(randomCandidates || []);
    setRounds(selectedRound);
    setIsSelectingRounds(false);
  };

  const handleOnWorldcupEnd = (finalWinnerCandidateId: string) => {
    setFinalWinnerCandidateId(finalWinnerCandidateId);
    setShowSidebar(true);
  };

  const handleWorldcupRestart = () => {
    setOpenStartWorldcupModal(true);
    setIsSelectingRounds(true);
  };

  if (isSelectingRounds) {
    return (
      <>
        <section className="relative flex bg-black h-[calc(100vh-68px)]">
          <h1 className="absolute bg-black/50 z-50 w-full text-center text-white text-2clamp font-bold">
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
          <WorldcupStarterModal
            nickname={worldcup.nickname}
            title={worldcup.title}
            description={worldcup.description}
            open={openStartWorldcupModal}
            createdAt={worldcup.createdAt}
            updatedAt={worldcup.updatedAt}
            candidatesCount={worldcup.candidatesCount}
            profilePath={worldcup.profilePath}
            onRoundSubmit={handleRoundSumbit}
          />
        </section>
      </>
    );
  }

  return (
    <div className="flex bg-black/95">
      <WorldcupPickScreen
        className="flex-1"
        worldcup={worldcup}
        defaultCandidates={candidates}
        startingRound={round as number}
        onWorldcupEnd={handleOnWorldcupEnd}
      />
      {showSidebar ? (
        <div className="p-8 w-[31rem] bg-white h-[calc(100vh-68px)] overflow-y-scroll">
          <section>
            <div className="flex mb-4 gap-1">
              <LinkButton
                href={`/wc/${worldcup.id}/stats`}
                className="flex justify-center items-center gap-1"
                variant="primary"
                size="small"
              >
                <ChartNoAxesColumnDecreasing size="1.2rem" color="#FFFFFF" />
                랭킹 보기
              </LinkButton>
              <Button
                className="flex justify-center items-center gap-1"
                variant="outline"
                size="small"
                onClick={() => setShareWorldcupModal(true)}
              >
                <Share color="#000000" size="1.2rem" />
                공유 하기
              </Button>
              <ShareWorldcupModal
                open={shareWorldcupModal}
                onClose={() => setShareWorldcupModal(false)}
                title={worldcup.title}
                worldcupId={worldcup.id}
              />
              <Button
                onClick={handleWorldcupRestart}
                variant="ghost"
                size="small"
                className="flex justify-center items-center gap-1"
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
            />
          </section>
          <CommentSection
            worldcupId={worldcup.id}
            finalWinnerCandidateId={finalWinnerCandidateId}
            userId={userId}
          />
        </div>
      ) : null}
    </div>
  );
}
