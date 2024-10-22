'use client';

import React, { useState } from 'react';
import { CandidateWithStatistics, Worldcup } from '@/app/lib/definitions';
import 'dayjs/locale/ko';
import Image from 'next/image';
import { BASE_IMAGE_URL } from '@/app/constants';

interface Props {
  candidates: CandidateWithStatistics[];
  worldcup: Worldcup;
}

export default function StatisticsScreen({ candidates, worldcup }: Props) {
  const [sortWinrateIncreasing, setSortWinrateIncreasing] =
    useState<boolean>(true);

  const candidatesWithWinrate = candidates.map((candidate) => ({
    ...candidate,
    winrate: calculateWinRate(candidate.numberOfWins, candidate.numberOfLosses),
  }));
  const winrateSortedCandidates = candidatesWithWinrate.sort((a, b) => {
    if (sortWinrateIncreasing) {
      return b.winrate - a.winrate;
    } else {
      return a.winrate - b.winrate;
    }
  });

  return (
    <section className='p-8 flex justify-center'>
      <table className='w-2/3'>
        <caption></caption>
        <thead>
          <tr className='text-slate-500 h-[40px] border bg-bg-400 text-base'>
            <th className='px-4' align='left'>
              순위
            </th>
            <th className='px-4' align='left'>
              후보
            </th>
            <th
              className='px-4 cursor-pointer text-primary-500'
              scope='col'
              align='center'
              onClick={() => setSortWinrateIncreasing((prev) => !prev)}
            >
              승률
            </th>
            <th className='px-4' scope='col' align='center'>
              우승 횟수
            </th>
          </tr>
        </thead>
        <tbody>
          {winrateSortedCandidates.map((candidate, i) => (
            <tr key={candidate.candidateId} className='border rounded-tl-lg'>
              <td className='px-4'>{i + 1}</td>
              <td className='flex items-center p-2'>
                <div className='relative w-[64px] h-[64px] rounded-lg overflow-hidden shrink-0'>
                  <Image
                    className='object-cover'
                    src={`${BASE_IMAGE_URL}${candidate.url}`}
                    alt={candidate.name}
                    fill={true}
                    sizes='(max-width: 768px) 17vw, (max-width: 1200px) 10vw, 10vw'
                  />
                </div>
                <span className='ml-4'>{candidate.name}</span>
              </td>
              <td className='px-4' align='center'>{`${candidate.winrate.toFixed(
                2
              )}%`}</td>
              <td className='px-4' align='center'>
                {candidate.numberOfTrophies}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
