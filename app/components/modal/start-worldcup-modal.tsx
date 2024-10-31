'use client';

import {
  DEFAULT_ROUNDS,
  getNumberOfRoundsAvailable,
  MIN_NUMBER_OF_CANDIDATES,
} from '@/app/constants';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import Button from '../ui/button';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

interface Props {
  open: boolean;
  onRoundSubmit: (round: number) => void;
  worldcupId?: string;
  numberOfCandidates: number;
  title: string;
  description: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
}

export default function StartWorldcupModal({
  open,
  onRoundSubmit,
  numberOfCandidates,
  title,
  description,
  createdAt,
  updatedAt,
  nickname,
}: Props) {
  const router = useRouter();
  const availableRounds = getNumberOfRoundsAvailable(numberOfCandidates);
  const [round, setRound] = useState<number>(
    numberOfCandidates >= DEFAULT_ROUNDS
      ? DEFAULT_ROUNDS
      : Math.max(...availableRounds)
  );
  const notEnoughCandidates = numberOfCandidates < MIN_NUMBER_OF_CANDIDATES;

  dayjs.extend(relativeTime);
  dayjs.locale('ko');

  const createdDate = dayjs(createdAt);
  const updatedDate = dayjs(updatedAt);
  const isUpdated = createdDate.diff(updatedDate);

  const handleRoundSubmit = () => {
    onRoundSubmit(round);
  };

  const handleRoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetRound = Number(e.target.value);
    setRound(targetRound);
  };

  return (
    <>
      {open &&
        createPortal(
          <div
            className='modal fixed inset-0 z-40 bg-black/80 w-screen h-screen'
            onClick={() => router.back()}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className='fixed inset-0 m-auto border bg-white rounded-xl p-6 min-w-[420px] h-fit w-fit animate-modalTransition'
            >
              <div>
                <div className='flex justify-between text-base text-gray-500 items-center my-3'>
                  <div>크리에이터: {nickname}</div>
                  <div>
                    {isUpdated
                      ? `${createdDate.fromNow()} 업데이트`
                      : `${updatedDate.fromNow()} 생성`}
                  </div>
                </div>
                <p className='text-base text-slate-700 max-w-[300px] mb-4'>
                  {description}
                </p>
                <p className='text-base text-gray-500 mb-3'>
                  {notEnoughCandidates
                    ? '후보 수가 충분하지 않아 시작할 수 없습니다.'
                    : `총 ${numberOfCandidates}명의 후보가 대기 중입니다.`}
                </p>
                <select
                  id={`${title} round`}
                  name='round'
                  className={`w-full text-center peer cursor-pointer rounded-md border border-gray-200 p-2 outline-2 focus:outline-primary-500 mb-2 text-base text-slate-700 font-semibold disabled:bg-gray-300`}
                  defaultValue={round}
                  onChange={handleRoundChange}
                  disabled={notEnoughCandidates}
                >
                  {notEnoughCandidates ? (
                    <option key={0}>
                      후보가 최소 {MIN_NUMBER_OF_CANDIDATES}명 필요합니다.
                    </option>
                  ) : (
                    availableRounds
                      .sort((a, b) => b - a)
                      .map((round) => (
                        <option key={round} value={round}>
                          무작위 후보 {round}명을 선택합니다.
                        </option>
                      ))
                  )}
                </select>
                {notEnoughCandidates ? (
                  <Button
                    variant='primary'
                    aria-label='Go back'
                    role='link'
                    onClick={() => router.back()}
                  >
                    돌아가기
                  </Button>
                ) : (
                  <Button variant='primary' onClick={handleRoundSubmit}>
                    시작하기!
                  </Button>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
