'use client';

import React, { createContext, useContext, useState } from 'react';
import { MATCH_STATUS, MatchStatus } from '@/app/constants';
import { WorldcupMatchCandidate, WorldcupMatchResult, WorldcupMatchWorldcup } from '../types';

interface WorldcupMatchContextType {
  worldcup: WorldcupMatchWorldcup;
  userId?: string;
  matchStatus: MatchStatus;
  setMatchStatus: (matchStatus: MatchStatus) => void;
  candidates: WorldcupMatchCandidate[];
  setCandidates: (candidates: WorldcupMatchCandidate[]) => void;
  matchResult: WorldcupMatchResult[];
  setMatchResult: (matchResult: WorldcupMatchResult[]) => void;
  finalWinnerCandidateId?: string;
  setFinalWinnerCandidateId: (finalWinnerCandidateId: string) => void;
  finalWinner?: WorldcupMatchCandidate;
}

const WorldcupMatchContext = createContext<WorldcupMatchContextType | null>(null);

interface Props {
  worldcup: WorldcupMatchWorldcup;
  userId?: string;
  children: React.ReactNode;
}

export function WorldcupMatchProvider({ worldcup, userId, children }: Props) {
  const [matchStatus, setMatchStatus] = useState<MatchStatus>(MATCH_STATUS.SELECTING_ROUNDS);
  const [candidates, setCandidates] = useState<WorldcupMatchCandidate[]>([]);
  const [matchResult, setMatchResult] = useState<WorldcupMatchResult[]>([]);
  const [finalWinnerCandidateId, setFinalWinnerCandidateId] = useState<string>();
  const finalWinner = finalWinnerCandidateId
    ? candidates.find(({ id }) => id === finalWinnerCandidateId)
    : undefined;

  return (
    <WorldcupMatchContext.Provider
      value={{
        worldcup,
        userId,
        matchStatus,
        setMatchStatus,
        candidates,
        setCandidates,
        matchResult,
        setMatchResult,
        finalWinnerCandidateId,
        setFinalWinnerCandidateId,
        finalWinner,
      }}
    >
      {children}
    </WorldcupMatchContext.Provider>
  );
}

export function useWorldcupMatch(): WorldcupMatchContextType {
  const context = useContext(WorldcupMatchContext);
  if (!context) {
    throw new Error('Out of provider');
  }
  return context;
}
