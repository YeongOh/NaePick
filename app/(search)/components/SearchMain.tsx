'use client';

import { useEffect } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

import CardGrid from '@/app/components/card/card-grid';
import CardGridEmpty from '@/app/components/card/card-grid-empty';
import MainNav from '@/app/components/main/main-nav';

import { getWorldcups } from '../action';

interface Props {
  sort?: 'latest' | 'popular';
  category?: string;
  query?: string;
}

export default function SearchMain({ sort, category, query }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['worldcups', { sort, category, query }],
    queryFn: ({ pageParam }) => getWorldcups({ sort, category, query, cursor: pageParam }),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  });
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const worldcups = data?.pages.flatMap((page) => page?.data) || [];

  useEffect(() => {
    if (inView && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, hasNextPage]);

  return (
    <section className="m-auto max-w-screen-2xl">
      {worldcups ? (
        <>
          <MainNav />
          <CardGrid ref={ref} worldcupCards={worldcups} />
        </>
      ) : (
        <CardGridEmpty />
      )}
      <footer className="h-16"></footer>
    </section>
  );
}
