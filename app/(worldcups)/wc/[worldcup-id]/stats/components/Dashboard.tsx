'use client';

import React, { useState } from 'react';
import CommentSection from '../../components/CommentSection';
import { Globe, RotateCcw, Share } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ThumbnailImage from '@/app/components/ThumbnailImage';
import Media from '@/app/components/media';
import Pagination from '@/app/components/pagination';
import WorldcupFold from '@/app/(worldcups)/wc/[worldcup-id]/components/WorldcupFold';
import LinkButton from '@/app/components/ui/link-button';
import Button from '@/app/components/ui/button';
import ShareWorldcupModal from '@/app/components/modal/share-worldcup-modal';
import { InferSelectModel } from 'drizzle-orm';
import { worldcups } from '@/app/lib/database/schema';

interface CandidateModel {
  id: string;
  name: string;
  path: string;
  thumbnailUrl: string | null;
  mediaType: string;
  winCount: number;
  lossCount: number;
  winRate: number;
}

interface Props {
  candidates: CandidateModel[];
  worldcup: InferSelectModel<typeof worldcups> & { nickname: string | null; profilePath: string | null };
  statCount: number;
  page: number;
  userId?: string;
}

export default function Dashboard({ candidates, worldcup, page, userId, statCount }: Props) {
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(0);
  const [shareWorldcupModal, setShareWorldcupModal] = useState(false);
  const router = useRouter();

  const selectedCandidate = candidates[selectedCandidateIndex];
  const currentRank = (page - 1) * 10 + (selectedCandidateIndex + 1);
  const totalPages = Math.ceil((statCount || 0) / 10);

  const handleShowDetailsOnClick = async (candidateIndex: number) => {
    setSelectedCandidateIndex(candidateIndex);
  };

  const handlePageNumberOnClick = async (page: number) => {
    router.push(`/wc/${worldcup.id}/stats?page=${page}`, {
      scroll: false,
    });
  };

  return (
    <div className="flex">
      <section className="w-[24rem] p-2 bg-gray-200">
        <div className="p-2 bg-gray-200">
          <ul className="overflow-hidden rounded">
            <div className="flex items-center text-sm border-b  bg-gray-50 h-8 text-gray-500">
              <div className="w-12 text-center">순위</div>
              <div className="w-16 overflow-hidden rounded"></div>
              <div className="flex-1 text-left ml-4">이름</div>
              <div className="w-20 mr-4 text-center">승률</div>
            </div>
            {candidates.map((candidate, i) => {
              const isSelected = i === selectedCandidateIndex;
              return (
                <li
                  className={`flex items-center text-base py-1 border-b cursor-pointer transition-colors ${
                    isSelected ? 'bg-primary-200' : 'bg-white hover:bg-primary-50'
                  }`}
                  key={candidate.id + i}
                  onClick={() => handleShowDetailsOnClick(i)}
                >
                  <div className="w-12 text-center text-gray-500">{(page - 1) * 10 + i + 1}</div>
                  <div className="w-16 h-16 overflow-hidden rounded">
                    <ThumbnailImage
                      name={candidate.name}
                      mediaType={candidate.mediaType}
                      path={candidate.path}
                      thumbnailURL={candidate.thumbnailUrl}
                      size="small"
                    />
                  </div>
                  <div className="flex-1 text-left ml-4 font-semibold text-slate-700 truncate">
                    {candidate.name}
                  </div>
                  <div className="w-20 mr-4 text-center text-slate-700">
                    {(candidate.winRate * 100).toFixed(1)}%
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="overflow-hidden rounded-bl rounded-br">
            <Pagination
              className="bg-white"
              totalPages={totalPages}
              currentPageNumber={page}
              range={2}
              onPageNumberClick={handlePageNumberOnClick}
            />
          </div>
        </div>
      </section>
      <div className="flex-1 bg-black/90 h-[calc(100vh-62px)] flex justify-center items-center relative">
        <h1 className="absolute top-0 bg-black/50 w-full text-center text-white text-2clamp font-bold">
          {worldcup.title}
        </h1>
        {selectedCandidate ? (
          <>
            <h2 className="absolute top-16 w-full text-center text-white text-clamp font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
              {currentRank}등 {selectedCandidate.name}
            </h2>
            <Media
              path={selectedCandidate?.path as string}
              name={selectedCandidate?.name as string}
              mediaType={selectedCandidate?.mediaType!}
              allowVideoControl
            />
          </>
        ) : (
          <h2 className="absolute top-1/2 -translate-y-1/2 text-center text-white text-clamp font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            아직 후보가 존재하지 않습니다.
          </h2>
        )}
      </div>
      <section className="p-8 w-[31rem] bg-white h-[calc(100vh-68px)] overflow-y-scroll">
        <div className="flex mb-4 gap-1">
          {' '}
          <LinkButton
            className="flex justify-center items-center gap-1"
            href={`/`}
            variant="primary"
            size="small"
          >
            <Globe size="1.2rem" />새 월드컵 찾기
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
          <LinkButton
            href={`/wc/${worldcup.id}`}
            variant="ghost"
            size="small"
            className="flex justify-center items-center gap-1"
          >
            <RotateCcw color="#334155" size="1.2rem" />
            다시 하기
          </LinkButton>
        </div>
        <WorldcupFold
          nickname={worldcup.nickname}
          createdAt={worldcup.createdAt}
          updatedAt={worldcup.updatedAt}
          description={worldcup.description}
          profilePath={worldcup.profilePath}
        />
        <CommentSection worldcupId={worldcup.id} userId={userId} />
      </section>
    </div>
  );
}
