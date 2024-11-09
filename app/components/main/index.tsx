'use client';

import { useEffect, useRef, useState } from 'react';
import CardGrid from '../card/card-grid';
import MainNav from './main-nav';
import CardGridEmpty from '../card/card-grid-empty';
import { getPopularWorldcups } from '@/app/(worldcups)/wc/[worldcup-id]/actions';

interface Cursor {
  gameCount: number;
  createdAt: string;
}

interface Props {
  worldcups: any;
  nextCursor: Cursor | null;
}

export default function Main({ worldcups, nextCursor }: Props) {
  const [dropdownMenuIndex, setDropdownMenuIndex] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [cursor, setCursor] = useState<Cursor | string | null>(nextCursor);
  const [newWorldcups, setNewWorldcups] = useState<any>([]);
  const lastWorldcupRef = useRef(null);

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
      if (entries[0].isIntersecting && !isFetching && cursor) {
        try {
          observer.unobserve(entries[0].target);
          setIsFetching(true);

          const result = await getPopularWorldcups(cursor);

          if (!result || !result.data) throw new Error();

          const { data, nextCursor } = result;
          if (data && Array.isArray(data)) setNewWorldcups((prev: any) => [...prev, ...data]);

          setCursor(nextCursor);
          setIsFetching(false);
        } catch (error) {
          console.error(error);
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.5,
    });

    if (lastWorldcupRef.current) observer.observe(lastWorldcupRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isFetching, cursor]);

  return (
    <section className="max-w-screen-2xl m-auto">
      {worldcups ? (
        <>
          <MainNav />
          <CardGrid
            ref={lastWorldcupRef}
            worldcupCards={[...worldcups, ...newWorldcups]}
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
