'use client';

import { WorldcupCard } from '@/app/lib/definitions';
import Card from './card';
import { useEffect, useRef, useState } from 'react';
import { getPublicWorldcupCards } from '@/app/lib/data/worldcups';

interface Props {
  worldcupCards: WorldcupCard[];
  extended?: boolean;
  hasNextPageProp: boolean;
}

export default function CardGrid({
  worldcupCards,
  extended,
  hasNextPageProp,
}: Props) {
  const [dropdownMenuIndex, setDropdownMenuIndex] = useState<number | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [cards, setCards] = useState(worldcupCards);
  const [isFetching, setIsFetching] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(hasNextPageProp);
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
    async function getNextCards() {
      setIsFetching(true);
      const { data, hasNextPage: responseHasNextPage }: any =
        await getPublicWorldcupCards(page + 1);
      if (data) {
        setCards((prev) => [...prev, ...data]);
      }
      setHasNextPage(responseHasNextPage);
      console.log('fetching ', page + 1);
      setIsFetching(false);
      setPage((prev) => prev + 1);
    }

    const handleIntersect = (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ) => {
      if (entries[0].isIntersecting && !isFetching && hasNextPage) {
        observer.unobserve(entries[0].target);
        getNextCards();
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.5,
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      console.log('disconnect');
      observer.disconnect();
    };
  }, [hasNextPage, isFetching, page]);

  return (
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
  );
}
