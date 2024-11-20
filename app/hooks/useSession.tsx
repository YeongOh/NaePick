'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SessionCookie } from '../lib/session/cookies';

interface SessionContextType {
  isLoading: boolean;
  session: SessionCookie | null;
  setSession: React.Dispatch<React.SetStateAction<SessionCookie | null>>;
}

const SessionContext = createContext<SessionContextType | null>(null);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<SessionCookie | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth')
      .then((res) => res.json())
      .then((data) => setSession(data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <SessionContext.Provider value={{ session, isLoading, setSession }}>{children}</SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('Out of Session provider');
  }
  return context;
};
