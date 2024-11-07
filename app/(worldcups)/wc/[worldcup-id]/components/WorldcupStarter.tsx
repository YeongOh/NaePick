'use client';

import { Candidate, Worldcup } from '@/app/lib/types';
import { useState } from 'react';
import { getRandomCandidatesByWorldcupId } from '@/app/lib/data/candidates';
import dynamic from 'next/dynamic';
import { MIN_NUMBER_OF_CANDIDATES } from '@/app/constants';
import 'dayjs/locale/ko';
import { ChartNoAxesColumnDecreasing, RotateCcw, Share } from 'lucide-react';
import PickScreen from './PickScreen';
import Fold from '@/app/components/fold';
import LinkButton from '@/app/components/ui/link-button';
import Button from '@/app/components/ui/button';
import ShareWorldcupModal from '@/app/components/modal/share-worldcup-modal';
import CommentSection from './CommentSection';

const StartWorldcupModal = dynamic(
  () => import('@/app/components/modal/start-worldcup-modal'),
  {
    ssr: false,
  }
);

interface Props {
  worldcup: Worldcup;
  userId?: string;
}

export default function WorldcupStarter({ worldcup, userId }: Props) {
  const [isSelectingRounds, setIsSelectingRounds] = useState<boolean>(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [round, setRounds] = useState<number | null>(null);
  const [openStartWorldcupModal, setOpenStartWorldcupModal] =
    useState<boolean>(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [shareWorldcupModal, setShareWorldcupModal] = useState(false);
  const [finalWinnerCandidateId, setFinalWinnerCandidateId] = useState<
    string | null
  >(null);

  const notEnoughCandidates =
    (worldcup.numberOfCandidates as number) < MIN_NUMBER_OF_CANDIDATES;

  const handleRoundSumbit = async (selectedRound: number) => {
    setOpenStartWorldcupModal(false);
    const randomCandidates = await getRandomCandidatesByWorldcupId(
      worldcup.worldcupId,
      selectedRound
    );
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
        <section className='relative flex bg-black h-[calc(100vh-68px)]'>
          <h1 className='absolute bg-black/50 z-50 w-full text-center text-white text-2clamp font-bold'>
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
          <StartWorldcupModal
            nickname={worldcup.nickname}
            title={worldcup.title}
            description={worldcup.description}
            open={openStartWorldcupModal}
            createdAt={worldcup.createdAt}
            updatedAt={worldcup.updatedAt}
            numberOfCandidates={worldcup.numberOfCandidates}
            profilePathname={worldcup.profilePathname}
            onRoundSubmit={handleRoundSumbit}
          />
        </section>
      </>
    );
  }

  return (
    <div className='flex bg-black/95'>
      <PickScreen
        className='flex-1'
        worldcup={worldcup}
        defaultCandidates={candidates}
        startingRound={round as number}
        onWorldcupEnd={handleOnWorldcupEnd}
      />
      {showSidebar ? (
        <div className='p-8 w-[31rem] bg-white h-[calc(100vh-68px)] overflow-y-scroll'>
          <section>
            <Fold
              nickname={worldcup.nickname}
              createdAt={worldcup.createdAt}
              updatedAt={worldcup.updatedAt}
              description={worldcup.description}
              profilePathname={worldcup.profilePathname}
            >
              <LinkButton
                href={`/wc/${worldcup.worldcupId}/stats`}
                className='flex justify-center items-center gap-1'
                variant='primary'
                size='small'
              >
                <ChartNoAxesColumnDecreasing size='1.2rem' color='#FFFFFF' />
                랭킹 보기
              </LinkButton>
              <Button
                className='flex justify-center items-center gap-1'
                variant='outline'
                size='small'
                onClick={() => setShareWorldcupModal(true)}
              >
                <Share color='#000000' size='1.2rem' />
                공유 하기
              </Button>
              <ShareWorldcupModal
                open={shareWorldcupModal}
                onClose={() => setShareWorldcupModal(false)}
                title={worldcup.title}
                worldcupId={worldcup.worldcupId}
              />
              <Button
                onClick={handleWorldcupRestart}
                variant='ghost'
                size='small'
                className='flex justify-center items-center gap-1'
              >
                <RotateCcw color='#334155' size='1.2rem' />
                다시 하기
              </Button>
            </Fold>
          </section>
          <CommentSection
            numberOfComments={worldcup.numberOfComments}
            worldcupId={worldcup.worldcupId}
            finalWinnerCandidateId={finalWinnerCandidateId}
            userId={userId}
          />
        </div>
      ) : null}
    </div>
  );
}
