'use client';

import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import CardGrid from '@/app/components/oldCard/card-grid';
import CardGridEmpty from '@/app/components/oldCard/card-grid-empty';
import MainNav from '@/app/components/oldMain/main-nav';
import { PopularNextCursor } from '@/app/lib/types';
import { getWorldcups } from '../action';

interface Props {
  sort?: 'latest' | 'popular';
  category?: string;
  query?: string;
  worldcups?: any;
  nextCursor?: any;
}

export default function SearchMain({ sort, category, query, worldcups = [], nextCursor }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['worldcups', { sort, category, query }],
    queryFn: ({ pageParam }) => getWorldcups({ sort, category, query, cursor: pageParam }),
    initialPageParam: nextCursor || '',
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
      <>
        <MainNav />
        <CardGrid ref={ref} worldcupCards={[...worldcups, ...newWorldcups]} />
      </>
      <footer className="h-16"></footer>
    </section>
  );
}
