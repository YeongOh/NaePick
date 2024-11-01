'use client';

import React, { useState } from 'react';
import {
  CandidateWithStatistics,
  Comment,
  Worldcup,
} from '@/app/lib/definitions';
import 'dayjs/locale/ko';
import ResponsiveThumbnailImage from '../thumbnail/responsive-thumbnail-image';
import ResponsiveMedia from '../media/responsive-media';
import CommentSection from '../comment/comment-section';
import Button from '../ui/button';
import LinkButton from '../ui/link-button';

import { getCandidateStatisticsByWorldcupIdAndPageNumber } from '@/app/lib/data/statistics';
import Pagination from '../pagination/pagination';
import Fold from '../fold/fold';
import { Globe, RotateCcw, Share } from 'lucide-react';
import ShareWorldcupModal from '../modal/share-worldcup-modal';

interface Props {
  candidates: CandidateWithStatistics[];
  worldcup: Worldcup;
  comments: Comment[];
}

export default function StatisticsMain({
  candidates: defaultCandidates,
  worldcup,
  comments,
}: Props) {
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(0);
  const [candidates, setCandidates] = useState(defaultCandidates);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [shareWorldcupModal, setShareWorldcupModal] = useState(false);

  const selectedCandidate = candidates[selectedCandidateIndex];

  const handleShowDetailsOnClick = async (candidateIndex: number) => {
    setSelectedCandidateIndex(candidateIndex);
  };

  const totalPages = Math.ceil((worldcup.numberOfCandidates || 0) / 10);
  const handlePageNumberOnClick = async (pageNumber: number) => {
    setCurrentPageNumber(pageNumber);
    const candidateData = await getCandidateStatisticsByWorldcupIdAndPageNumber(
      worldcup.worldcupId,
      pageNumber
    );
    if (candidateData) {
      setCandidates(candidateData);
      setSelectedCandidateIndex(0);
    }
  };

  return (
    <div className='flex'>
      <section className='w-[24rem] p-2 bg-gray-200'>
        <div className='p-2 bg-gray-200'>
          <ul className='overflow-hidden rounded'>
            <div className='flex items-center text-sm border-b  bg-gray-50 h-8 text-gray-500'>
              <div className='w-12 text-center'>순위</div>
              <div className='w-16 overflow-hidden rounded'></div>
              <div className='flex-1 text-left ml-4'>이름</div>
              <div className='w-20 mr-4 text-center'>승률</div>
            </div>
            {candidates.map((candidate, i) => {
              const isSelected = i === selectedCandidateIndex;
              return (
                <li
                  className={`flex items-center text-base py-1 border-b cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-primary-200'
                      : 'bg-white hover:bg-primary-50'
                  }`}
                  key={candidate.candidateId + i}
                  onClick={() => handleShowDetailsOnClick(i)}
                >
                  <div className='w-12 text-center text-gray-500'>
                    {(currentPageNumber - 1) * 10 + i + 1}
                  </div>
                  <div className='w-16 h-16 overflow-hidden rounded'>
                    <ResponsiveThumbnailImage
                      name={candidate.name}
                      mediaType={candidate.mediaType}
                      pathname={candidate.pathname}
                      thumbnailURL={candidate.thumbnailURL}
                      size='small'
                    />
                  </div>
                  <div className='flex-1 text-left ml-4 font-semibold text-slate-700'>
                    {candidate.name}
                  </div>
                  <div className='w-20 mr-4 text-center text-slate-700'>
                    {(candidate.winRate * 100).toFixed(1)}%
                  </div>
                </li>
              );
            })}
          </ul>
          <div className='overflow-hidden rounded-bl rounded-br'>
            <Pagination
              totalPages={totalPages}
              currentPageNumber={currentPageNumber}
              range={2}
              onPageNumberClick={handlePageNumberOnClick}
            />
          </div>
        </div>
      </section>
      {selectedCandidate && (
        <div className='flex-1 bg-black/90 h-[calc(100vh-62px)] flex justify-center items-center'>
          <ResponsiveMedia
            pathname={selectedCandidate?.pathname as string}
            name={selectedCandidate?.name as string}
            mediaType={selectedCandidate?.mediaType!}
            allowVideoControl
          />
        </div>
      )}
      <section className='p-8 w-[31rem] bg-white'>
        <Fold
          nickname={worldcup.nickname}
          createdAt={worldcup.createdAt}
          updatedAt={worldcup.updatedAt}
          description={worldcup.description}
        >
          <LinkButton
            className='flex justify-center items-center gap-1'
            href={`/`}
            variant='primary'
            size='small'
          >
            <Globe size='1.2rem' />새 월드컵 찾기
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
          <LinkButton
            href={`/worldcups/${worldcup.worldcupId}`}
            variant='ghost'
            size='small'
            className='flex justify-center items-center gap-1'
          >
            <RotateCcw color='#334155' size='1.2rem' />
            다시 하기
          </LinkButton>
        </Fold>
        <CommentSection worldcupId={worldcup.worldcupId} comments={comments} />
      </section>
    </div>
  );
}

function calculateWinRate(
  numberOfWins: number,
  numberOfLosses: number
): number {
  if (numberOfWins === 0) {
    return 0;
  }
  return (numberOfWins / (numberOfLosses + numberOfWins)) * 100;
}
