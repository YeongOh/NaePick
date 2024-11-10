'use client';

import CardGrid from '@/app/components/card/card-grid';
import CardGridEmpty from '@/app/components/card/card-grid-empty';
import MainNav from '@/app/components/main/main-nav';
import { translateCategory } from '@/app/lib/types';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { getWorldcups } from '../action';

interface Props {
  sort: 'latest' | 'popular';
  category?: string;
}

export default function SearchMain({ sort, category }: Props) {
  const [dropdownMenuIndex, setDropdownMenuIndex] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [cursor, setCursor] = useState<any>();
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
    setWorldcups([]);
    setCursor(undefined);
  }, [sort, category]);

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
          const result = await getWorldcups(sort, cursor, category);
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
      getWorldcups(sort, cursor, category).then((result) => {
        if (result?.data) setWorldcups(result.data);
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
  }, [isFetching, cursor, sort, category]);

  return (
    <section className="max-w-screen-2xl m-auto">
      {worldcups ? (
        <>
          <MainNav>
            {category ? (
              <Link
                className="flex items-center justify-center bg-black/80 text-white border rounded p-2 text-base hover:bg-black/90"
                href={sort === 'popular' ? '/' : `/search?sort=${sort}`}
              >
                <span className="text-white">{translateCategory(category)}</span>
              </Link>
            ) : null}
          </MainNav>
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
