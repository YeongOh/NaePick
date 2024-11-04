'use client';

import { InfiniteScrollData, WorldcupCard } from '@/app/lib/definitions';
import Card from './card';
import { useEffect, useRef, useState } from 'react';

type FetchCardsFunc = (
  cursor: string | null,
  ...args: any[]
) => Promise<InfiniteScrollData<WorldcupCard> | undefined>;

interface Props {
  worldcupCards: WorldcupCard[];
  extended?: boolean;
  cursor?: string | null;
  getNextCardsFunc: FetchCardsFunc;
  nextCardsArgs?: string[];
}

export default function CardGrid({
  worldcupCards,
  extended,
  getNextCardsFunc,
  nextCardsArgs,
  cursor: cursorProp = null,
}: Props) {
  const [dropdownMenuIndex, setDropdownMenuIndex] = useState<number | null>(
    null
  );
  const [isFetching, setIsFetching] = useState(false);
  const [lastCursor, setLastCursor] = useState<string | null>(cursorProp);
  const [fetchedCards, setFetchedCards] = useState<WorldcupCard[]>([]);
  const ref = useRef(null);

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
        if (nextCardsArgs && nextCardsArgs.length) {
          result = await getNextCardsFunc(lastCursor, ...nextCardsArgs);
        } else {
          result = await getNextCardsFunc(lastCursor);
        }
        if (!result) {
          throw new Error();
        }
        console.log('fetched');
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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isFetching, lastCursor, getNextCardsFunc, nextCardsArgs]);

  return (
    <>
      <ul className='grid grid-cols-card-12rem sm:grid-cols-card-14rem md:grid-cols-card-16rem lg:grid-cols-card-18rem justify-center gap-2 mt-4'>
        {worldcupCards.map((worldcup, index: number) => (
          <Card
            ref={
              worldcupCards.length + fetchedCards.length <= 20 &&
              index === worldcupCards.length - 1
                ? ref
                : null
            }
            key={worldcup.worldcupId}
            worldcupCard={worldcup}
            openDropdownMenu={dropdownMenuIndex === index}
            onOpenDropdownMenu={() => setDropdownMenuIndex(index)}
            onCloseDropdownMenu={() => setDropdownMenuIndex(null)}
            extended={extended}
          />
        ))}
        {fetchedCards.map((worldcup, index: number) => (
          <Card
            ref={
              worldcupCards.length + fetchedCards.length > 20 &&
              index === worldcupCards.length - 1
                ? ref
                : null
            }
            key={worldcup.worldcupId}
            worldcupCard={worldcup}
            openDropdownMenu={dropdownMenuIndex === index}
            onOpenDropdownMenu={() => setDropdownMenuIndex(index)}
            onCloseDropdownMenu={() => setDropdownMenuIndex(null)}
            extended={extended}
          />
        ))}
      </ul>
      <footer className='h-16'></footer>
    </>
  );
}
