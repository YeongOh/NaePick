'use client';

import {
  getInfinitePopularWorldcupCards,
  getInfiniteLatestWorldcupCards,
  getInfinitePopularWorldcupCardsByCategory,
} from '@/app/lib/data/worldcups';
import { WorldcupCard } from '@/app/lib/definitions';
import { useEffect, useRef, useState } from 'react';
import CardGrid from '../card/card-grid';
import MainNav from './main-nav';
import CardGridEmpty from '../card/card-grid-empty';

interface Props {
  params: 'latest' | 'popular' | 'popularCategory';
  initialWorldcupCards: WorldcupCard[] | null;
  cursor: string | number | null;
  funcArgs?: string;
}

export default function Main({
  params,
  initialWorldcupCards,
  cursor,
  funcArgs,
}: Props) {
  const [dropdownMenuIndex, setDropdownMenuIndex] = useState<number | null>(
    null
  );
  const [isFetching, setIsFetching] = useState(false);
  const [lastCursor, setLastCursor] = useState<string | number | null>(cursor);
  const [fetchedCards, setFetchedCards] = useState<WorldcupCard[]>([]);
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
    const handleIntersect = async (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ) => {
      if (entries[0].isIntersecting && !isFetching && lastCursor) {
        observer.unobserve(entries[0].target);
        setIsFetching(true);
        let result;
        if (params === 'popular') {
          result = await getInfinitePopularWorldcupCards(lastCursor as number);
        } else if (params === 'latest') {
          result = await getInfiniteLatestWorldcupCards(lastCursor as string);
        } else if (params === 'popularCategory') {
          result = await getInfinitePopularWorldcupCardsByCategory(
            lastCursor as number,
            funcArgs as string
          );
        }
        if (!result) {
          throw new Error();
        }
        const { data, cursor } = result;
        if (data) {
          setFetchedCards((prev) => [...prev, ...data]);
        }
        setLastCursor(cursor);
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
    <section className='max-w-screen-2xl m-auto'>
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
      <footer className='h-16'></footer>
    </section>
  );
}
