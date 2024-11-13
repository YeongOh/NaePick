'use client';

import CardGrid from '@/app/components/card/card-grid';
import CardGridEmpty from '@/app/components/card/card-grid-empty';
import MainNav from '@/app/components/main/main-nav';
import { translateCategory } from '@/app/lib/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getWorldcups } from '../action';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';

interface Props {
  sort: 'latest' | 'popular';
  category?: string;
}

export default function SearchMain({ sort, category }: Props) {
  const [dropdownMenuIndex, setDropdownMenuIndex] = useState<number | null>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['worldcups', { sort, category }],
    queryFn: ({ pageParam }) => getWorldcups({ sort, category, cursor: pageParam }),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  });
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const worldcups = data?.pages.flatMap((page) => page?.data) || [];

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
    if (inView && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, hasNextPage]);

  useEffect(() => {
    if (dropdownMenuIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownMenuIndex]);

  return (
    <section className="m-auto max-w-screen-2xl">
      {worldcups ? (
        <>
          <MainNav>
            {category ? (
              <Link
                className="flex items-center justify-center rounded border bg-black/80 p-2 text-base text-white hover:bg-black/90"
                href={sort === 'popular' ? '/' : `/search?sort=${sort}`}
              >
                <span className="text-white">{translateCategory(category)}</span>
              </Link>
            ) : null}
          </MainNav>
          <CardGrid ref={ref} worldcupCards={worldcups} />
        </>
      ) : (
        <CardGridEmpty />
      )}
      <footer className="h-16"></footer>
    </section>
  );
}
