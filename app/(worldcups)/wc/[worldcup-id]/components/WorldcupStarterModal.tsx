'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { DEFAULT_ROUNDS, MatchStatus, MIN_NUMBER_OF_CANDIDATES } from '@/app/constants';
import Avatar from '@/app/ui/Avatar';
import Button from '@/app/ui/Button';
import ExpandableText from '@/app/ui/ExpandableText';
import dayjs from '@/app/utils/dayjs';
import { getRandomCandidates } from '../actions';
import { useSavedWorldcupMatch } from '../hooks/useSavedWorldcupMatch';
import { useWorldcupMatch } from '../hooks/useWorldcupMatch';
import { getNumberOfRoundsAvailable } from '../utils';

interface Props {
  open: boolean;
}

export default function WorldcupStarterModal({ open }: Props) {
  const { worldcup, setCandidates, setBreakPoint, setMatchStatus, setMatchResult } = useWorldcupMatch();
  const { candidatesCount, title, description, createdAt, updatedAt, nickname, profilePath } = worldcup;
  const availableRounds = getNumberOfRoundsAvailable(candidatesCount);
  const [round, setRound] = useState<number>(
    candidatesCount >= DEFAULT_ROUNDS ? DEFAULT_ROUNDS : Math.max(...availableRounds),
  );
  const { savedWorldcup } = useSavedWorldcupMatch();
  const router = useRouter();

  const notEnoughCandidates = candidatesCount < MIN_NUMBER_OF_CANDIDATES;
  const isSavedWorldcup = savedWorldcup?.id === worldcup.id;
  const createdDate = dayjs(createdAt);
  const updatedDate = dayjs(updatedAt);
  const isUpdated = createdDate.diff(updatedDate);

  const handleRoundSubmit = async () => {
    const randomCandidates = await getRandomCandidates(worldcup.id, round);
    setCandidates(randomCandidates || []);
    setBreakPoint(randomCandidates || [], []);
    setMatchStatus(MatchStatus.IDLE);
  };

  const handleRoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetRound = Number(e.target.value);
    setRound(targetRound);
  };

  const handleLoadSavedWorldcup = () => {
    if (!savedWorldcup) {
      return;
    }
    setCandidates(savedWorldcup.candidates);
    setMatchResult(savedWorldcup.matchResult);
    setBreakPoint(savedWorldcup.candidates, savedWorldcup.matchResult);
    setMatchStatus(MatchStatus.IDLE);
  };

  return (
    <>
      {open &&
        createPortal(
          <div className="modal fixed inset-0 z-40 h-screen w-screen bg-black/80">
            <div
              onClick={(e) => e.stopPropagation()}
              className="fixed left-1/2 top-1/2 w-[26rem] max-w-[95%] -translate-x-1/2 -translate-y-1/2 animate-modalTransition rounded-xl border bg-white p-3 lg:p-6"
            >
              <div className="relative">
                <div className="mb-2 flex items-center">
                  <Avatar
                    profilePath={profilePath}
                    className="mr-2"
                    size="sm"
                    alt={nickname ? nickname : '탈퇴한 회원'}
                  />
                  <div>
                    <div className="text-md font-semibold text-slate-700">
                      {nickname ? nickname : '탈퇴한 회원'}
                    </div>
                    <div className="mb-2 text-sm text-gray-500">
                      {isUpdated ? `${updatedDate.fromNow()} 업데이트` : `${createdDate.fromNow()} 생성`}
                    </div>
                  </div>
                </div>
                <button
                  aria-label="돌아가기"
                  className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-slate-700"
                  onClick={() => router.back()}
                >
                  <X size={'1.2rem'} />
                </button>
                <div className="mb-2">
                  <ExpandableText
                    className={'w-full text-slate-700'}
                    text={description ? description : ''}
                    size="md"
                  />
                </div>
                <p className="mb-2 text-sm text-gray-500">
                  {notEnoughCandidates
                    ? '후보 수가 충분하지 않아 시작할 수 없습니다.'
                    : `총 ${candidatesCount}명의 후보가 대기 중입니다.`}
                </p>
                <select
                  id={`${title} round`}
                  name="round"
                  className={`peer mb-2 w-full cursor-pointer rounded-md border border-gray-200 p-2 text-center text-base font-semibold text-slate-700 outline-2 focus:outline-primary-500 disabled:bg-gray-300`}
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
                  <Button
                    variant="outline"
                    className="w-full"
                    aria-label="Go back"
                    role="link"
                    onClick={() => router.back()}
                  >
                    돌아가기
                  </Button>
                ) : (
                  <>
                    <Button variant="primary" className="w-full" onClick={handleRoundSubmit}>
                      시작
                    </Button>
                    {isSavedWorldcup && (
                      <Button variant="outline" className="mt-1 w-full" onClick={handleLoadSavedWorldcup}>
                        저장된 이상형 월드컵 이어하기
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
