'use client';

import { DEFAULT_ROUNDS, getNumberOfRoundsAvailable, MIN_NUMBER_OF_CANDIDATES } from '@/app/constants';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Button from '../ui/button';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import ToggleableP from '../ui/toggleable-p';
import Avatar from '../ui/Avatar';

interface Props {
  open: boolean;
  onRoundSubmit: (round: number) => void;
  worldcupId?: string;
  candidatesCount: number;
  title: string;
  description: string | null;
  nickname: string | null;
  createdAt: string;
  updatedAt: string;
  profilePath: string | null;
}

export default function StartWorldcupModal({
  open,
  onRoundSubmit,
  candidatesCount,
  title,
  description,
  createdAt,
  updatedAt,
  nickname,
  profilePath,
}: Props) {
  const router = useRouter();
  const availableRounds = getNumberOfRoundsAvailable(candidatesCount);
  const [round, setRound] = useState<number>(
    candidatesCount >= DEFAULT_ROUNDS ? DEFAULT_ROUNDS : Math.max(...availableRounds)
  );
  const notEnoughCandidates = candidatesCount < MIN_NUMBER_OF_CANDIDATES;

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
            className="modal fixed inset-0 z-40 bg-black/80 w-screen h-screen"
            onClick={() => router.back()}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border bg-white rounded-xl p-6 w-[26rem] animate-modalTransition"
            >
              <div>
                <div className="mb-2 flex items-center">
                  <Avatar
                    profilePath={profilePath}
                    className="mr-2"
                    size="small"
                    alt={nickname ? nickname : '탈퇴한 회원'}
                  />
                  <div>
                    <div className="text-md text-slate-700 font-semibold">
                      {nickname ? nickname : '탈퇴한 회원'}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {isUpdated ? `${updatedDate.fromNow()} 업데이트` : `${createdDate.fromNow()} 생성`}
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <ToggleableP
                    className={'text-slate-700 w-full'}
                    text={description ? description : ''}
                    numberOfLines={5}
                  />
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {notEnoughCandidates
                    ? '후보 수가 충분하지 않아 시작할 수 없습니다.'
                    : `총 ${candidatesCount}명의 후보가 대기 중입니다.`}
                </p>
                <select
                  id={`${title} round`}
                  name="round"
                  className={`w-full text-center peer cursor-pointer rounded-md border border-gray-200 p-2 outline-2 focus:outline-primary-500 mb-2 text-base text-slate-700 font-semibold disabled:bg-gray-300`}
                  defaultValue={round}
                  onChange={handleRoundChange}
                  disabled={notEnoughCandidates}
                >
                  {notEnoughCandidates ? (
                    <option key={0}>후보가 최소 {MIN_NUMBER_OF_CANDIDATES}명 필요합니다.</option>
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
                  <Button variant="primary" aria-label="Go back" role="link" onClick={() => router.back()}>
                    돌아가기
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleRoundSubmit}
                    className="flex justify-center items-center gap-1"
                  >
                    시작
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
