'use client';

import React, { useState } from 'react';
import CommentSection from '../../components/CommentSection';
import { ChevronLeft, ChevronRight, Globe, RotateCcw, Share } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Media from '@/app/components/media';
import Pagination from '@/app/components/pagination';
import WorldcupFold from '@/app/(worldcups)/wc/[worldcup-id]/components/WorldcupFold';
import LinkButton from '@/app/components/ui/link-button';
import Button from '@/app/components/ui/button';
import ShareWorldcupModal from '@/app/components/modal/share-worldcup-modal';
import { InferSelectModel } from 'drizzle-orm';
import { worldcups } from '@/app/lib/database/schema';
import DashboardRanking from './DashboardRanking';
import ThumbnailImage from '@/app/components/ThumbnailImage';

export interface CandidateStatModel {
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
  candidates: CandidateStatModel[];
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

  const handlePageNumberOnClick = async (page: number) => {
    router.push(`/wc/${worldcup.id}/stats?page=${page}`, {
      scroll: false,
    });
  };

  return (
    <div className="flex h-[calc(100svh-61px)] flex-col lg:h-auto lg:flex-row">
      <section className="hidden w-[24rem] bg-gray-200 p-2 lg:block">
        <div className="bg-gray-200 p-2">
          <DashboardRanking
            onShowDetails={setSelectedCandidateIndex}
            selectedIndex={selectedCandidateIndex}
            candidates={candidates}
            page={page}
          />
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
      <section className="relative flex h-[calc(30svh-20px)] flex-1 items-center justify-center bg-black/90 lg:h-[calc(100svh-60px)]">
        <h1 className="absolute top-0 w-full bg-black/50 text-center text-3xl font-bold text-white lg:text-5xl">
          {worldcup.title}
        </h1>
        {selectedCandidate ? (
          <>
            <div className="absolute bottom-0 text-center text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] lg:bottom-10">
              <h2 className="text-xl font-bold lg:text-2xl">
                {currentRank}등 {selectedCandidate.name} <br />
              </h2>
              <span className="text-lg font-bold lg:text-lg">
                {' '}
                승률: {selectedCandidate.winRate === 0 ? '0' : (selectedCandidate.winRate * 100).toFixed(1)}%
              </span>
            </div>
            <Media
              path={selectedCandidate?.path as string}
              name={selectedCandidate?.name as string}
              mediaType={selectedCandidate?.mediaType!}
              allowVideoControl
            />
          </>
        ) : null}
        {candidates.length === 0 ? (
          <h2 className="absolute top-1/2 -translate-y-1/2 text-center text-3xl font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] lg:text-5xl">
            아직 후보가 존재하지 않습니다.
          </h2>
        ) : null}
        {page <= 1 && selectedCandidateIndex <= 0 ? null : (
          <button
            type="button"
            className="absolute left-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow"
            onClick={() => {
              if (selectedCandidateIndex === 0) {
                handlePageNumberOnClick(page - 1);
                setSelectedCandidateIndex(9);
                return;
              }
              setSelectedCandidateIndex((prev) => prev - 1);
            }}
          >
            <ChevronLeft className="text-primary-500 hover:text-primary-600 active:text-primary-700" />
          </button>
        )}
        {page >= totalPages && selectedCandidateIndex >= candidates.length - 1 ? null : (
          <button
            type="button"
            className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow"
            onClick={() => {
              if (selectedCandidateIndex === candidates.length - 1) {
                handlePageNumberOnClick(page + 1);
                setSelectedCandidateIndex(0);
                return;
              }
              setSelectedCandidateIndex((prev) => prev + 1);
            }}
          >
            <ChevronRight className="text-primary-500 hover:text-primary-600 active:text-primary-700" />
          </button>
        )}
      </section>
      <section className="h-12 bg-black/90 lg:hidden">
        <ul className="flex items-center gap-1 overflow-hidden rounded p-1">
          {candidates.map((candidate, i) => {
            const isSelected = i === selectedCandidateIndex;
            return (
              <li
                className={`cursor-pointer text-base hover:outline hover:outline-primary-100 ${isSelected ? 'outline outline-primary-500' : ''}`}
                key={'mobile' + candidate.id + i}
                onClick={() => setSelectedCandidateIndex(i)}
              >
                <div className="relative flex h-10 max-w-10 overflow-hidden rounded">
                  <ThumbnailImage
                    name={candidate.name}
                    mediaType={candidate.mediaType}
                    path={candidate.path}
                    thumbnailURL={candidate.thumbnailUrl}
                    size="small"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="h-[calc(60svh-20px)] overflow-y-scroll bg-white p-3 lg:h-auto lg:w-[31rem] lg:p-8">
        <div className="mb-4 flex gap-1">
          <LinkButton
            className="flex items-center justify-center gap-1"
            href={`/`}
            variant="primary"
            size="small"
          >
            <Globe size="1.2rem" />새 월드컵 찾기
          </LinkButton>
          <Button
            className="flex items-center justify-center gap-1"
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
            className="flex items-center justify-center gap-1"
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
