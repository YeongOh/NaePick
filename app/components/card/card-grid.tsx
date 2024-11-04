'use client';

import { WorldcupCard } from '@/app/lib/definitions';
import Card from './card';
import { useEffect, useRef, useState } from 'react';
import { getPublicWorldcupCards } from '@/app/lib/data/worldcups';

interface Props {
  worldcupCards: WorldcupCard[];
  extended?: boolean;
  cursor: string | null;
}

export default function CardGrid({
  worldcupCards,
  extended,
  cursor: cursorProp,
}: Props) {
  const [dropdownMenuIndex, setDropdownMenuIndex] = useState<number | null>(
    null
  );
  const [cards, setCards] = useState(worldcupCards);
  const [isFetching, setIsFetching] = useState(false);
  const [lastCursor, setLastCursor] = useState<string | null>(cursorProp);
  const ref = useRef(null);

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.menubar') &&
      !target.closest('.menubar-toggle') &&
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
        const result = await getPublicWorldcupCards(lastCursor);
        if (!result) {
          throw new Error();
        }
        const { data, cursor } = result;
        if (data) {
          setCards((prev) => [...prev, ...data]);
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
  }, [isFetching, lastCursor]);

  return (
    <>
      <ul className='grid grid-cols-card-12rem sm:grid-cols-card-14rem md:grid-cols-card-16rem lg:grid-cols-card-18rem justify-center gap-2 mt-4'>
        {cards.map((worldcup, index: number) => (
          <Card
            ref={index === cards.length - 1 ? ref : null}
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
