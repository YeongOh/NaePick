'use client';

import React, { createContext, useContext, useState } from 'react';
import { MatchStatus, MatchStatusType } from '@/app/constants';
import { WorldcupMatchCandidate, WorldcupMatchResult, WorldcupMatchWorldcup } from '../types';

interface WorldcupMatchContextType {
  worldcup: WorldcupMatchWorldcup;
  userId?: string;
  matchStatus: MatchStatusType;
  setMatchStatus: (matchStatus: MatchStatusType) => void;
  candidates: WorldcupMatchCandidate[];
  setCandidates: (candidates: WorldcupMatchCandidate[]) => void;
  matchResult: WorldcupMatchResult[];
  setMatchResult: (matchResult: WorldcupMatchResult[]) => void;
  finalWinnerCandidateId?: string;
  setFinalWinnerCandidateId: (finalWinnerCandidateId: string) => void;
  finalWinner?: WorldcupMatchCandidate;
  setBreakPoint: (candidates: WorldcupMatchCandidate[], matchResult: WorldcupMatchResult[]) => void;
  goBack: () => void;
  canGoBack: boolean;
}

const WorldcupMatchContext = createContext<WorldcupMatchContextType | null>(null);

interface Props {
  worldcup: WorldcupMatchWorldcup;
  userId?: string;
  children: React.ReactNode;
}

export function WorldcupMatchProvider({ worldcup, userId, children }: Props) {
  const [matchStatus, setMatchStatus] = useState<MatchStatusType>(MatchStatus.SELECTING_ROUNDS);
  const [candidatesHistory, setCandidatesHistory] = useState<WorldcupMatchCandidate[][]>([]);
  const [matchResultHistory, setMatchResultHistory] = useState<WorldcupMatchResult[][]>([]);
  const [candidates, setCandidates] = useState<WorldcupMatchCandidate[]>([]);
  const [matchResult, setMatchResult] = useState<WorldcupMatchResult[]>([]);
  const [finalWinnerCandidateId, setFinalWinnerCandidateId] = useState<string>();
  const finalWinner = finalWinnerCandidateId
    ? candidates.find(({ id }) => id === finalWinnerCandidateId)
    : undefined;
  const canGoBack = candidatesHistory.length > 1 && matchResultHistory.length > 1;

  function setBreakPoint(candidates: WorldcupMatchCandidate[], matchResult: WorldcupMatchResult[]) {
    const newCandidatesHistory = [...candidatesHistory, candidates];
    const newMatchResultHistory = [...matchResultHistory, matchResult];
    setCandidatesHistory(newCandidatesHistory.slice(-4));
    setMatchResultHistory(newMatchResultHistory.slice(-4));
  }

  function goBack() {
    if (canGoBack) {
      setCandidates(candidatesHistory.at(-2) || []);
      setMatchResult(matchResultHistory.at(-2) || []);
      setCandidatesHistory(candidatesHistory.slice(0, -1));
      setMatchResultHistory(matchResultHistory.slice(0, -1));
    }
  }

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
        setBreakPoint,
        goBack,
        canGoBack,
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
