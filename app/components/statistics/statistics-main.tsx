'use client';

import React, { useState } from 'react';
import { CandidateWithStatistics, Worldcup } from '@/app/lib/definitions';
import 'dayjs/locale/ko';
import ResponsiveThumbnailImage from '../thumbnail/responsive-thumbnail-image';
import dayjs from 'dayjs';
import ThumbnailWinrateOverlay from '../thumbnail/thumbnail-winrate-overlay';
import ResponsiveMedia from '../media/responsive-media';

interface Props {
  candidates: CandidateWithStatistics[];
  worldcup: Worldcup;
}

export default function StatisticsMain({ candidates, worldcup }: Props) {
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState<
    number | null
  >(null);

  const candidatesWithWinrate = candidates
    .map((candidate) => ({
      ...candidate,
      winrate: calculateWinRate(
        candidate.numberOfWins,
        candidate.numberOfLosses
      ),
      championRate: calculateWinRate(
        candidate.numberOfTrophies,
        candidate.numberOfLosses
      ),
    }))
    .sort((a, b) => b.winrate - a.winrate);

  const handleShowDetailsOnClick = async (
    candidateIndex: number,
    candidateId: string
  ) => {
    if (candidateIndex === selectedCandidateIndex) {
      setSelectedCandidateIndex(null);
    } else {
      setSelectedCandidateIndex(candidateIndex);
    }
  };
  const selectedCandidate =
    selectedCandidateIndex !== null
      ? candidatesWithWinrate[selectedCandidateIndex]
      : null;

  return (
    <section className=''>
      <ul className='relative flex justify-center flex-wrap h-full p-8 gap-1'>
        {candidatesWithWinrate.slice(0, 5).map((candidate, i) => {
          const isSelected = i === selectedCandidateIndex;
          let borderClassName = 'border-black';
          if (i == 0) borderClassName = 'border-yellow-500 border-2';
          if (i == 1) borderClassName = 'border-gray-300 border-2';
          if (i == 2) borderClassName = 'border-yellow-800 border-2';
          return (
            <li
              key={candidate.candidateId + i}
              onClick={() => {
                handleShowDetailsOnClick(i, candidate.candidateId);
              }}
              className={`border ${borderClassName} relative group w-[150px] h-[250px] overflow-hidden rounded-md transition-transform cursor-pointer select-none ${
                isSelected ? '-translate-y-5' : 'hover:-translate-y-3'
              }`}
            >
              <ThumbnailWinrateOverlay
                candidate={candidate}
                isSelected={isSelected}
              />
              <ResponsiveThumbnailImage
                name={candidate.name}
                mediaType={candidate.mediaType}
                pathname={candidate.pathname}
                thumbnailURL={candidate.thumbnailURL}
                size='large'
              />
            </li>
          );
        })}
      </ul>
      {selectedCandidate && (
        <div>
          <h2 className='text-slate-700 font-semibold text-3xl m-2 text-center'>
            {(selectedCandidateIndex as number) + 1}등 -{' '}
            {selectedCandidate.name}
          </h2>
          <div className='bg-black w-full'>
            <div className='w-full h-[400px] flex justify-center'>
              <ResponsiveMedia
                pathname={selectedCandidate?.pathname as string}
                name={selectedCandidate?.name as string}
                mediaType={selectedCandidate?.mediaType!}
                allowVideoControl
              />
            </div>
          </div>
          <h2 className='text-slate-700 font-semibold text-xl m-2 text-center'>
            <span className='mr-4'>
              Win/Loss {selectedCandidate.winrate.toFixed(1)}% (
              {selectedCandidate.numberOfWins}W -{' '}
              {selectedCandidate.numberOfLosses}L){' '}
            </span>
            <span>
              Champion {selectedCandidate.championRate.toFixed(1)}% (
              {selectedCandidate.numberOfTrophies}W)
            </span>
          </h2>
        </div>
      )}
      <div className='p-8 flex justify-center flex-wrap'>
        <ul className='relative flex justify-center h-full p-8 gap-1'>
          {candidatesWithWinrate.slice(5, 11).map((candidate, i) => {
            const isSelected = i + 5 === selectedCandidateIndex;
            return (
              <li
                key={candidate.candidateId + i}
                onClick={() => {
                  handleShowDetailsOnClick(i + 5, candidate.candidateId);
                }}
                className={`border border-black relative group w-[150px] h-[250px] overflow-hidden rounded-md transition-transform cursor-pointer select-none ${
                  isSelected ? '-translate-y-5' : 'hover:-translate-y-3'
                }`}
              >
                <ThumbnailWinrateOverlay
                  candidate={candidate}
                  isSelected={isSelected}
                />
                <ResponsiveThumbnailImage
                  name={candidate.name}
                  mediaType={candidate.mediaType}
                  pathname={candidate.pathname}
                  thumbnailURL={candidate.thumbnailURL}
                  size='large'
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
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
