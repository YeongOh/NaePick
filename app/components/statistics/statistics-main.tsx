'use client';

import React, { useState } from 'react';
import {
  Candidate,
  CandidateWithStatistics,
  Worldcup,
} from '@/app/lib/definitions';
import 'dayjs/locale/ko';
import Preview from '../preview/preview';
import VerticalCard from './vertical-card';

interface Props {
  candidates: CandidateWithStatistics[];
  worldcup: Worldcup;
}

export default function StatisticsMain({ candidates, worldcup }: Props) {
  const [sortWinrateIncreasing, setSortWinrateIncreasing] =
    useState<boolean>(true);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [selectedCandidateToPreview, setSelectedCandidateToPreview] =
    useState<Candidate | null>(null);
  const [selectedCandidateToShowDetails, setSelectedCandidateToShowDetails] =
    useState<number | null>(null);

  const candidatesWithWinrate = candidates.map((candidate) => ({
    ...candidate,
    winrate: calculateWinRate(candidate.numberOfWins, candidate.numberOfLosses),
    championRate: calculateWinRate(
      candidate.numberOfTrophies,
      candidate.numberOfLosses
    ),
  }));
  const winrateSortedCandidates = candidatesWithWinrate.sort((a, b) => {
    if (sortWinrateIncreasing) {
      return b.winrate - a.winrate;
    } else {
      return a.winrate - b.winrate;
    }
  });
  console.log(candidatesWithWinrate);

  console.log(selectedCandidateToShowDetails);
  return (
    <>
      <div className='bg-black'>
        <h1 className='text-white text-2clamp text-center'>{worldcup.title}</h1>

        <ul className='relative w-full flex m-auto justify-center bg-black h-full p-8 gap-1'>
          {candidatesWithWinrate.slice(0, 3).map((candidate, i) => {
            const isSelected = i === selectedCandidateToShowDetails;

            return (
              <li
                key={candidate.candidateId + i}
                onClick={() => {
                  if (isSelected) setSelectedCandidateToShowDetails(null);
                  setSelectedCandidateToShowDetails(i);
                }}
                className={`border-white border relative group w-[150px] h-[250px] overflow-hidden rounded-md transition-transform cursor-pointer select-none ${
                  isSelected ? '-translate-y-5' : 'hover:-translate-y-1'
                }`}
              >
                <div
                  className={`absolute size-full opacity-0 transition-opacity bg-black text-white font-semibold ${
                    isSelected ? 'opacity-80' : 'group-hover:opacity-80'
                  }`}
                >
                  <div className='flex flex-col p-2 justify-between size-full'>
                    <div>
                      <div className='text-5xl'>
                        {!candidate.winrate ? 0 : candidate.winrate.toFixed(1)}%
                      </div>
                      <div className='text-2xl'>Win/Loss</div>
                    </div>
                    <div>
                      <div className='text-xl'>
                        {!candidate.championRate
                          ? 0
                          : candidate.championRate.toFixed(1)}
                        %
                      </div>
                      <div className='text-xl'>Champion</div>
                    </div>
                    <span>
                      {candidate.numberOfWins}W - {candidate.numberOfLosses}L
                    </span>
                  </div>
                  <div
                    className={`absolute left-3/4 top-full origin-top-left transform -rotate-90 transition-transform text-2xl w-full ${
                      isSelected
                        ? '-translate-y-8'
                        : 'group-hover:-translate-y-8'
                    }`}
                  >
                    {candidate.name}
                  </div>
                </div>
                <span
                  className={`absolute text-white left-1 bottom-1 font-semibold text-lg group-hover:opacity-0 cursor-default ${
                    isSelected ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  {candidate.name}
                </span>
                <VerticalCard candidate={candidate} />
              </li>
            );
          })}
        </ul>
      </div>
      <section className='p-8 flex justify-center bg-gray-50 max-w-screen-lg m-auto flex-wrap'>
        <ul className='size-full flex flex-wrap gap-1'>
          {candidatesWithWinrate.map(
            (
              candidate: CandidateWithStatistics & {
                winrate: number;
              },
              i
            ) => {
              return (
                <li
                  key={candidate.candidateId + i}
                  className='relative w-[100px] h-[150px] overflow-hidden rounded-md'
                >
                  <span className='absolute text-white left-1 bottom-1 font-semibold text-base'>
                    {candidate.name}
                  </span>
                  <VerticalCard candidate={candidate} />
                </li>
              );
            }
          )}
        </ul>
        {selectedCandidateToPreview && (
          <Preview
            open={showPreview}
            onClose={() => {
              setShowPreview(false);
              setSelectedCandidateToPreview(null);
            }}
            src={`${selectedCandidateToPreview.pathname}?w=1920&h=1760`}
            alt={`${selectedCandidateToPreview.name}`}
          />
        )}
      </section>
    </>
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
