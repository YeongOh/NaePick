'use client';

import {
  getInfinitePopularWorldcupCards,
  getInfiniteLatestWorldcupCards,
  getInfinitePopularWorldcupCardsByCategory,
} from '@/app/lib/data/worldcups';
import { WorldcupCard } from '@/app/lib/types';
import { useEffect, useRef, useState } from 'react';
import CardGrid from '../card/card-grid';
import MainNav from './main-nav';
import CardGridEmpty from '../card/card-grid-empty';
import { getWorldcups } from '@/app/lib/worldcup/service';

interface Props {
  params: 'latest' | 'popular' | 'popularCategory';
  initialWorldcupCards: any;
  nextCursor?: string;
  funcArgs?: string;
}

export default function Main({ params, initialWorldcupCards, funcArgs, nextCursor }: Props) {
  const [dropdownMenuIndex, setDropdownMenuIndex] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [lastCursor, setLastCursor] = useState<string | undefined>(nextCursor);
  const [fetchedCards, setFetchedCards] = useState<any>([]);
  const lastCardRef = useRef(null);

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.dropdown-menu') &&
      !target.closest('.dropdown-menu-toggle') &&
      !target.closest('.modal')
    ) {
      setDropdownMenuIndex(null);
    }
  };

  useEffect(() => {
    if (dropdownMenuIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownMenuIndex]);

  useEffect(() => {
    const handleIntersect = async (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      if (entries[0].isIntersecting && !isFetching && lastCursor) {
        observer.unobserve(entries[0].target);
        setIsFetching(true);
        // if (params === 'popular') {
        //   result = await getInfinitePopularWorldcupCards(lastCursor as number);
        // } else if (params === 'latest') {
        //   result = await getInfiniteLatestWorldcupCards(lastCursor as string);
        // } else if (params === 'popularCategory') {
        //   result = await getInfinitePopularWorldcupCardsByCategory(
        //     lastCursor as number,
        //     funcArgs as string
        //   );
        // }
        const result = await getWorldcups(lastCursor);
        console.log(result);

        if (!result || !result.data) {
          throw new Error();
        }
        const { data, nextCursor } = result;
        if (data) {
          setFetchedCards((prev: any) => [...prev, ...data]);
        }
        console.log(nextCursor);
        setLastCursor(nextCursor);
        setIsFetching(false);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.5,
    });

    if (lastCardRef.current) {
      observer.observe(lastCardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isFetching, lastCursor]);

  return (
    <section className="max-w-screen-2xl m-auto">
      {initialWorldcupCards ? (
        <>
          <MainNav />
          <CardGrid
            ref={lastCardRef}
            worldcupCards={[...initialWorldcupCards, ...fetchedCards]}
            dropdownMenuIndex={dropdownMenuIndex}
            onOpenDropdownMenu={(index) => setDropdownMenuIndex(index)}
            onCloseDropdownMenu={() => setDropdownMenuIndex(null)}
          />
        </>
      ) : (
        <CardGridEmpty />
      )}
      <footer className="h-16"></footer>
    </section>
  );
}
