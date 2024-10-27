'use client';

import React, { useState } from 'react';
import {
  Candidate,
  CandidateWithStatistics,
  Worldcup,
} from '@/app/lib/definitions';
import 'dayjs/locale/ko';
import Preview from '../preview/preview';
import CandidateThumbnailImage from '../thumbnail/CandidateThumbnailImage';
import MyImage from '@/app/ui/my-image/my-image';
import { MdAutoGraph } from 'react-icons/md';
import { IoMdTrophy } from 'react-icons/io';

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
    <>
      <div className='relative w-full flex m-auto justify-center bg-black h-[400px]'>
        <div>
          {winrateSortedCandidates[0].mediaType === 'cdn_video' && (
            <div className='max-w-fit w-full h-full'>
              <video
                className='w-full h-full object-contain'
                autoPlay
                playsInline
                loop
                muted
              >
                <source
                  src={`https://cdn.naepick.co.kr/${winrateSortedCandidates[0].pathname}`}
                  type='video/mp4'
                />
              </video>
            </div>
          )}
          {winrateSortedCandidates[0].mediaType === 'cdn_img' && (
            <div className='max-w-fit w-full h-full'>
              <MyImage
                className='object-contain w-full h-full'
                src={`${winrateSortedCandidates[0].pathname}?w=1920&h=1760`}
                alt={winrateSortedCandidates[0].name}
              />
            </div>
          )}
          {winrateSortedCandidates[0].mediaType === 'youtube' && (
            <div className='size-full flex items-center justify-center'>
              <iframe
                onClick={(e) => e.stopPropagation()}
                className='w-full h-full max-h-full aspect-video'
                src={`https://www.youtube-nocookie.com/embed/${winrateSortedCandidates[0].pathname}`}
                title='Youtube video player'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                referrerPolicy='strict-origin-when-cross-origin'
                allowFullScreen
              />
            </div>
          )}
          {winrateSortedCandidates[0].mediaType === 'chzzk' && (
            <div className='w-full h-full max-h-full flex items-center justify-center'>
              <iframe
                onClick={(e) => e.stopPropagation()}
                className='w-full h-full aspect-video'
                src={`https://chzzk.naver.com/embed/clip/${winrateSortedCandidates[0].pathname}`}
                title='CHZZK Player'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                referrerPolicy='strict-origin-when-cross-origin'
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
      <section className='p-8 flex justify-center bg-gray-50 max-w-screen-lg m-auto flex-wrap'>
        <ul className='size-full flex flex-wrap gap-1'>
          {candidatesWithWinrate.map(
            ({
              candidateId,
              pathname,
              name,
              mediaType,
              winrate,
              numberOfTrophies,
              thumbnailURL,
            }: CandidateWithStatistics & {
              winrate: number;
            }) => {
              return (
                <li
                  key={candidateId}
                  className='w-[calc(50%-6px)] min-w-[350px] flex items-center border rounded-lg overflow-hidden bg-white justify-between'
                >
                  <div className='w-[100px] h-[85px] overflow-hidden flex-shrink-0'>
                    <CandidateThumbnailImage
                      mediaType={mediaType}
                      pathname={pathname}
                      name={name}
                      thumbnailURL={thumbnailURL}
                      size='medium'
                    />
                  </div>
                  <h3 className='font-semibold text-slate-700 text-base flex-1 text-center'>
                    {name}
                  </h3>
                  <div className='flex flex-col items-center gap-1 mx-4'>
                    <span className='text-sm flex items-center gap-1 text-gray-500'>
                      <MdAutoGraph className='text-green-500' />
                      win rate
                    </span>
                    <span className='text-base'>{winrate.toFixed(2)} %</span>
                  </div>
                  <div className='flex flex-col items-center gap-1'>
                    <span className='text-sm flex items-center gap-1 mr-4 text-gray-500'>
                      <IoMdTrophy className='text-yellow-500' />
                      trophies
                    </span>
                    <span className='text-base'>{numberOfTrophies}</span>
                  </div>
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
