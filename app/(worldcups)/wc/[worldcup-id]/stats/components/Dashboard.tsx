'use client';

import React, { useState } from 'react';
import { InferSelectModel } from 'drizzle-orm';
import { ChevronLeft, ChevronRight, Globe, RotateCcw, Share } from 'lucide-react';
import { useRouter } from 'next/navigation';
import WorldcupFold from '@/app/(worldcups)/wc/[worldcup-id]/components/WorldcupFold';
import CandidateMedia from '@/app/components/CandidateMedia';
import CandidateThumbnail from '@/app/components/CandidateThumbnail';
import ShareWorldcupModal from '@/app/components/Modal/ShareWorldcupModal';
import Pagination from '@/app/components/Pagination';
import { worldcups } from '@/app/lib/database/schema';
import Button from '@/app/ui/Button';
import LinkButton from '@/app/ui/LinkButton';
import DashboardRankingChart from './DashboardRankingChart';
import CommentSection from '../../components/CommentSection';

export interface CandidateStatModel {
  id: string;
  name: string;
  path: string;
  thumbnailUrl: string | null;
  mediaType: string;
  winCount: number;
  lossCount: number;
  winRate: number;
  trophyCount: number;
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
    setSelectedCandidateIndex(0);
  };

  return (
    <div className="flex h-[calc(100svh-61px)] flex-grow flex-col lg:flex-row">
      <section className="hidden w-1/5 bg-gray-200 p-2 lg:block lg:max-w-[24rem] lg:flex-1">
        <div className="bg-gray-200 p-2">
          <DashboardRankingChart
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
      <section className="relative flex min-h-[45svh] items-center justify-center bg-black/90 lg:h-auto lg:min-w-[40%] lg:flex-1">
        <h1 className="absolute top-0 w-full bg-black/50 text-center text-xl font-bold text-white lg:text-5xl">
          {worldcup.title}
        </h1>
        {selectedCandidate ? (
          <>
            <div className="absolute bottom-0 text-center text-white drop-shadow-text lg:bottom-auto lg:top-20">
              <h2 className="text-xl font-bold lg:text-5xl">
                {currentRank}등 {selectedCandidate.name} <br />
              </h2>
              <span className="text-lg font-bold lg:text-4xl">
                {' '}
                승률: {selectedCandidate.winRate === 0 ? '0' : (selectedCandidate.winRate * 100).toFixed(1)}%
                ({selectedCandidate.trophyCount}우승 | {selectedCandidate.winCount}승{' '}
                {selectedCandidate.lossCount}패)
              </span>
            </div>
            <CandidateMedia
              key={selectedCandidate.id}
              path={selectedCandidate?.path as string}
              name={selectedCandidate?.name as string}
              mediaType={selectedCandidate?.mediaType!}
            />
          </>
        ) : null}
        {candidates.length === 0 ? (
          <h2 className="absolute top-1/2 -translate-y-1/2 text-center text-3xl font-bold text-white drop-shadow-text lg:text-5xl">
            아직 후보가 존재하지 않습니다.
          </h2>
        ) : null}
        {page <= 1 && selectedCandidateIndex <= 0 ? null : (
          <button
            type="button"
            className="absolute left-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow"
            aria-label="전 후보"
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
            aria-label="다음 후보"
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
      <section className="bg-black/90 lg:hidden">
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
                  <CandidateThumbnail
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
      <section className="flex-col overflow-y-scroll bg-white p-3 lg:h-full lg:max-w-[28rem] lg:flex-1 lg:p-8">
        <div className="mb-4 flex gap-1">
          <LinkButton className="w-full text-sm lg:h-10 lg:text-base" href={`/`} variant="primary" size="sm">
            <Globe size="1.2rem" />
            월드컵 찾기
          </LinkButton>
          <Button
            className="w-full text-sm lg:h-10 lg:text-base"
            variant="outline"
            size="sm"
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
            size="sm"
            className="w-full text-sm lg:h-10 lg:text-base"
          >
            <RotateCcw color="#334155" size="1.2rem" />
            다시 하기
          </LinkButton>
        </div>
        <WorldcupFold
          worldcupId={worldcup.id}
          userId={userId}
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
