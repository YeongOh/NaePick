import { createContext, useContext } from 'react';
import { TCard } from '../lib/types';

interface WorldcupCardContext {
  worldcupCard: TCard;
  type: 'default' | 'update' | 'favourite';
  userId?: string;
}

export const WorldcupCardContext = createContext<WorldcupCardContext | null>(null);

export const useWorldcupCard = () => {
  const context = useContext(WorldcupCardContext);
  if (!context) {
    throw new Error('useWorldcupCardContext must be used within a WorldcupCardProvider');
  }
  return context;
};
