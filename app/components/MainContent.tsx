'use client';

import React, { Suspense, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { getPopularWorldcups } from '@/app/(search)/action';
import Grid from '@/app/ui/Grid';
import Spinner from '@/app/ui/Spinner';
import NavigationFilter from './NavigationFilter';
import WorldcupCard from './WorldcupCard/WorldcupCard';
import { TCard } from '../lib/types';

interface Cursor {
  matchCount: number;
  createdAt: string;
}

interface Props {
  initialData: { data: TCard[]; nextCursor: Cursor | null };
}

export default function MainContent({ initialData }: Props) {
  const transformedInitialData = {
    pages: [{ data: initialData.data, nextCursor: initialData.nextCursor }],
    pageParams: [null],
  };
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['worldcups', { main: 'main' }],
    queryFn: ({ pageParam }) => getPopularWorldcups({ cursor: pageParam }),
    initialPageParam: initialData.nextCursor,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    initialData: transformedInitialData,
  });
  const worldcupCards = data?.pages.flatMap((page) => page?.data) || [];

  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetching, hasNextPage]);

  return (
    <React.Fragment>
      <Suspense>
        <NavigationFilter />
      </Suspense>
      <Grid>
        {worldcupCards.map((worldcupCard) => (
          <WorldcupCard key={worldcupCard.id} worldcupCard={worldcupCard} />
        ))}
      </Grid>
      <div ref={ref} className="flex h-12 items-center justify-center">
        {isFetching && <Spinner />}
      </div>
    </React.Fragment>
  );
}
