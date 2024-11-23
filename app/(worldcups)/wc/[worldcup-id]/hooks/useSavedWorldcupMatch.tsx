'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { WorldcupMatchCandidate, WorldcupMatchResult, WorldcupMatchWorldcup } from '../types';

interface WorldcupSave {
  id: string;
  candidates: WorldcupMatchCandidate[];
  matchResult: WorldcupMatchResult[];
}

interface SavedWorldcupMatchContextType {
  savedWorldcup: WorldcupSave | null;
  saveWorldcup: (candidates: WorldcupMatchCandidate[], matchResult: WorldcupMatchResult[]) => void;
}

const SavedWorldcupMatchContext = createContext<SavedWorldcupMatchContextType | null>(null);

interface Props {
  worldcupId: string;
  children: React.ReactNode;
}

export function SavedWorldcupMatchProvider({ worldcupId, children }: Props) {
  const [savedWorldcup, setSavedWorldcup] = useState<WorldcupSave | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('saved-worldcup');
    if (saved) {
      setSavedWorldcup(JSON.parse(saved));
    }
  }, []);

  function saveWorldcup(candidates: WorldcupMatchCandidate[], matchResult: WorldcupMatchResult[]) {
    localStorage.setItem('saved-worldcup', JSON.stringify({ id: worldcupId, candidates, matchResult }));
  }

  return (
    <SavedWorldcupMatchContext.Provider
      value={{
        savedWorldcup,
        saveWorldcup,
      }}
    >
      {children}
    </SavedWorldcupMatchContext.Provider>
  );
}

export function useSavedWorldcupMatch(): SavedWorldcupMatchContextType {
  const context = useContext(SavedWorldcupMatchContext);
  if (!context) {
    throw new Error('Out of provider');
  }
  return context;
}
