'use client';

import { Suspense, useEffect } from 'react';
import CardGrid from '../card/card-grid';
import MainNav from './main-nav';
import CardGridEmpty from '../card/card-grid-empty';
import { getPopularWorldcups } from '@/app/(search)/action';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';

interface Cursor {
  matchCount: number;
  createdAt: string;
}

interface Props {
  worldcups: any;
  nextCursor: Cursor | null;
}

export default function Main({ worldcups, nextCursor }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['worldcups', { main: 'main' }],
    queryFn: ({ pageParam }) => getPopularWorldcups({ cursor: pageParam }),
    initialPageParam: nextCursor,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  });
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const newWorldcups = data?.pages.flatMap((page) => page?.data) || [];

  useEffect(() => {
    if (inView && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, hasNextPage]);

  return (
    <section className="m-auto max-w-screen-2xl">
      {worldcups ? (
        <>
          <Suspense>
            <MainNav />
          </Suspense>
          <CardGrid ref={ref} worldcupCards={[...worldcups, ...newWorldcups]} />
        </>
      ) : (
        <CardGridEmpty />
      )}
      <footer className="h-16"></footer>
    </section>
  );
}
