'use client';

import CardGrid from '@/app/components/card/card-grid';
import CardGridEmpty from '@/app/components/card/card-grid-empty';
import MainNav from '@/app/components/main/main-nav';
import { getPopularWorldcups } from '@/app/lib/worldcup/service';
import { useEffect, useRef, useState } from 'react';

interface Cursor {
  gameCount: number;
  createdAt: string;
}

interface Props {
  sort: 'latest' | 'popular';
}

export default function SearchMain({ sort }: Props) {
  const [dropdownMenuIndex, setDropdownMenuIndex] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [cursor, setCursor] = useState<Cursor | null>();
  const [worldcups, setWorldcups] = useState<any>([]);
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
      if (entries[0].isIntersecting && !isFetching && cursor != null) {
        try {
          setIsFetching(true);
          observer.unobserve(entries[0].target);
          const result = await getPopularWorldcups(cursor);
          if (!result || !result.data) throw new Error();

          const { data, nextCursor } = result;

          if (data && Array.isArray(data)) setWorldcups((prev: any) => [...prev, ...data]);

          setCursor(nextCursor);
          setIsFetching(false);
        } catch (error) {
          console.error(error);
        }
      }
    };

    if (cursor === undefined) {
      getPopularWorldcups(cursor).then((result) => {
        setWorldcups(result?.data);
        setCursor(result?.nextCursor);
      });
    }

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
            worldcupCards={worldcups}
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
