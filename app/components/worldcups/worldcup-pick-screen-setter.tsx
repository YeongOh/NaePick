'use client';

import { Candidate, Comment, Worldcup } from '@/app/lib/definitions';
import { useState } from 'react';
import WorldcupPickScreen from './worldcup-pick-screen';
import { getRandomCandidatesByWorldcupId } from '@/app/lib/data/candidates';
import dynamic from 'next/dynamic';
import { MIN_NUMBER_OF_CANDIDATES } from '@/app/constants';
import CommentSection from '../comment/comment-section';
import Button from '../ui/button';
import LinkButton from '../ui/link-button';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import { ChartNoAxesColumnDecreasing, RotateCcw, Share } from 'lucide-react';
import Fold from '../fold/fold';
import ShareWorldcupModal from '../modal/share-worldcup-modal';

const StartWorldcupModal = dynamic(
  () => import('../modal/start-worldcup-modal'),
  {
    ssr: false,
  }
);

interface Props {
  worldcup: Worldcup;
  comments: Comment[];
}

export default function WorldcupPickScreenSetter({
  worldcup,
  comments,
}: Props) {
  const [isSelectingRounds, setIsSelectingRounds] = useState<boolean>(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [round, setRounds] = useState<number | null>(null);
  const [openStartWorldcupModal, setOpenStartWorldcupModal] =
    useState<boolean>(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [shareWorldcupModal, setShareWorldcupModal] = useState(false);

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

  const handleOnWorldcupEnd = async () => {
    setShowSidebar(true);
  };

  const handleWorldcupRestart = () => {
    setOpenStartWorldcupModal(true);
    setIsSelectingRounds(true);
  };

  if (isSelectingRounds) {
    return (
      <>
        <section className='relative flex bg-black h-[calc(100vh-62px)]'>
          <div className='absolute left-1/2 -translate-x-1/2 bg-black bg-opacity-30 z-50 w-full'>
            <h2 className='text-center text-white text-2clamp font-bold'>
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
            </h2>
          </div>
          <StartWorldcupModal
            nickname={worldcup.nickname}
            title={worldcup.title}
            description={worldcup.description}
            open={openStartWorldcupModal}
            createdAt={worldcup.createdAt}
            updatedAt={worldcup.updatedAt}
            numberOfCandidates={worldcup.numberOfCandidates as number}
            onRoundSubmit={handleRoundSumbit}
          />
        </section>
      </>
    );
  }

  const createdDate = dayjs(worldcup.createdAt);
  const updatedDate = dayjs(worldcup.updatedAt);
  const isUpdated = createdDate.diff(updatedDate);

  return (
    <div className='flex bg-black/95'>
      <WorldcupPickScreen
        className='flex-1'
        worldcup={worldcup}
        defaultCandidates={candidates}
        startingRound={round as number}
        onWorldcupEnd={handleOnWorldcupEnd}
      />
      {showSidebar ? (
        <div className='p-8 w-[31rem] bg-white'>
          <section>
            <Fold
              nickname={worldcup.nickname}
              createdAt={worldcup.createdAt}
              updatedAt={worldcup.updatedAt}
              description={worldcup.description}
            >
              <LinkButton
                href={`/worldcups/${worldcup.worldcupId}/stats`}
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
            comments={comments}
            worldcupId={worldcup.worldcupId}
          />
        </div>
      ) : null}
    </div>
  );
}
