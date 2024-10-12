'use client';

import { Candidate, PostStat } from '@/app/lib/definitions';
import Image from 'next/image';
import { useState } from 'react';
import 'dayjs/locale/ko';
import { BASE_IMAGE_URL } from '@/app/lib/images';

interface Props {
  candidates: Candidate[];
  postStat: PostStat;
}

type sortOptions =
  | 'increasingGameWinRate'
  | 'decreasingGameWinRate'
  | 'increasingMatchWinRate'
  | 'decreasingMatchWinRate';

export default function RankScreen({ candidates, postStat }: Props) {
  const [limit, setLimit] = useState(2);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<sortOptions>('increasingGameWinRate');
  const [winRateDetails, setWinRateDetails] = useState(false);

  const sortedCandidates = candidates.sort((a, b) => {
    const gameWinRateA = calculateWinRate(a.numberOfGamesWon, a.numberOfGames);
    const gameWinRateB = calculateWinRate(b.numberOfGamesWon, b.numberOfGames);
    const matchWinRateA = calculateWinRate(
      a.numberOfMatchesWon,
      a.numberOfMatches
    );
    const matchWinRateB = calculateWinRate(
      b.numberOfMatchesWon,
      b.numberOfMatches
    );
    switch (sortBy) {
      case 'increasingMatchWinRate':
        return matchWinRateB - matchWinRateA;
      case 'decreasingMatchWinRate':
        return matchWinRateA - matchWinRateB;
      case 'decreasingGameWinRate':
        return gameWinRateA - gameWinRateB;
      default:
        return gameWinRateB - gameWinRateA;
    }
  });

  const totalPages = Math.ceil(candidates.length / limit);
  const spentTimePerGame =
    postStat.totalSpentTime === 0
      ? 0
      : Math.ceil(postStat.totalSpentTime / postStat.numberOfGames);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (
      e.target.value === 'increasingMatchWinRate' ||
      e.target.value === 'decreasingMatchWinRate' ||
      e.target.value === 'increasingGameWinRate' ||
      e.target.value === 'decreasingGameWinRate'
    ) {
      setSortBy(e.target.value);
    }
  };

  return (
    <>
      <section className='p-4'>
        <div className='relative my-4'>
          <div className='font-semibold text-lg my-2'>게임 통계</div>
          <div>매치 수: {postStat.numberOfMatches}</div>
          <div>게임 수: {postStat.numberOfGames}</div>
          <div>게임 평균 소요 시간: {spentTimePerGame}s</div>
        </div>
        <div className='font-semibold text-lg my-4'>후보 통계</div>
        <label htmlFor='sortBy' className='mb-2 block font-semibold'>
          정렬 순서
        </label>
        <select
          id='sortBy'
          name='sortBy'
          className='peer block w-full cursor-pointer rounded-md border border-gray-200 p-2 outline-2 placeholder:text-gray-500 focus:outline-teal-500 shadow-sm hover:shadow-lg'
          onChange={handleSortChange}
          defaultValue={sortBy}
        >
          <option
            key='increasingGameWinRate'
            value='increasingGameWinRate'
            className='text-teal-600'
          >
            ↑ 높은 게임 승률
          </option>
          <option
            key='decreasingGameWinRate'
            value='decreasingGameWinRate'
            className='text-teal-600'
          >
            ↓ 낮은 게임 승률
          </option>
          <option
            key='increasingMatchWinRate'
            value='increasingMatchWinRate'
            className='text-orange-600'
          >
            ↑ 높은 매치 승률
          </option>
          <option
            key='decreasingMatchWinRate'
            value='decreasingMatchWinRate'
            className='text-orange-600'
          >
            ↓ 낮은 매치 승률
          </option>
        </select>
      </section>
      <div className='relative m-4'>
        <ul>
          {sortedCandidates.map((candidate: Candidate, index: number) => {
            const matchWinRate = calculateWinRate(
              candidate.numberOfMatchesWon,
              candidate.numberOfMatches
            );
            const gameWinRate = calculateWinRate(
              candidate.numberOfGamesWon,
              candidate.numberOfGames
            );
            const spentTimePerMatch =
              candidate.spentTime === 0
                ? 0
                : Math.ceil(candidate.spentTime / candidate.numberOfMatches);

            return (
              <li key={candidate.id} className='flex'>
                <div>
                  <div className='relative w-[180px] h-[180px] overflow-hidden'>
                    <Image
                      src={`${BASE_IMAGE_URL}${candidate.url}`}
                      alt={candidate.name}
                      fill
                      objectFit='cover'
                    />
                    <div className='absolute top-1 left-1 bg-white rounded-full text-sm w-6 h-6 flex justify-center items-center shadow-lg font-semibold text-slate-600'>
                      {index + 1}
                    </div>
                    <div className='absolute bottom-1 text-white text-sm truncate drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-bold'>
                      {candidate.name}
                    </div>
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-1 px-2'>
                  <div
                    className='relative flex w-full h-5 bg-gray-200 overflow-hidden'
                    role='progressbar'
                    onMouseOver={() => setWinRateDetails(true)}
                    onMouseOut={() => setWinRateDetails(false)}
                  >
                    <div
                      className={`flex flex-col justify-center bg-teal-600 text-s text-center whitespace-nowrap ${
                        gameWinRate === 0 ? 'text-transparent' : 'text-white'
                      }`}
                      style={{
                        width: `${gameWinRate}%`,
                      }}
                    >
                      {gameWinRate}%{' '}
                      {winRateDetails
                        ? `(게임 수: ${candidate.numberOfGames} | 게임 승: ${candidate.numberOfGamesWon})`
                        : null}
                    </div>
                  </div>
                  <div
                    className='relative flex w-full h-5 bg-gray-200 overflow-hidden'
                    role='progressbar'
                    onMouseOver={() => setWinRateDetails(true)}
                    onMouseOut={() => setWinRateDetails(false)}
                  >
                    <div
                      className={`flex flex-col justify-center bg-orange-600 text-s text-center whitespace-nowrap ${
                        matchWinRate === 0 ? 'text-transparent' : 'text-white'
                      }`}
                      style={{
                        width: `${matchWinRate}%`,
                      }}
                    >
                      {matchWinRate}%{' '}
                      {winRateDetails
                        ? `(매치 수: ${candidate.numberOfMatches} | 매치 승: ${candidate.numberOfMatchesWon})`
                        : null}
                    </div>
                  </div>

                  <div>후보 이름: {candidate.name}</div>
                  <div>
                    <span className='mr-4'>
                      게임 수: {candidate.numberOfGames}
                    </span>
                    <span className='mr-4'>
                      게임 승리 수: {candidate.numberOfGamesWon}
                    </span>
                    <span>게임 승률: {gameWinRate}%</span>
                  </div>
                  <div>
                    <span className='mr-4'>
                      매치 수: {candidate.numberOfMatches}
                    </span>
                    <span className='mr-4'>
                      매치 승리 수: {candidate.numberOfMatchesWon}
                    </span>
                    <span>매치 승률: {matchWinRate}%</span>
                  </div>
                  <div>
                    <span className='mr-4'>
                      매치 평균 소요 시간: {spentTimePerMatch}s
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className='flex justify-center items-center space-x-1 m-4'>
          {[...new Array(totalPages)].map((_, i) => (
            <button
              key={`button for page${i + 1}`}
              className={`${
                page === i + 1
                  ? `bg-teal-600 border-teal-600 text-white`
                  : 'text-slate-600 hover:shadow-lg'
              } min-w-9 rounded-md border border-slate-300 py-2 px-3 text-center text-sm shadow-sm`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function calculateWinRate(
  numberOfWins: number,
  numberOfMatches: number
): number {
  return numberOfWins === 0
    ? 0
    : Math.floor((numberOfWins / numberOfMatches) * 100);
}
