'use client';

import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import NavigationFilter from '@/app/components/NavigationFilter';
import WorldcupCard from '@/app/components/WorldcupCard/WorldcupCard';
import Grid from '@/app/ui/Grid';
import Spinner from '@/app/ui/Spinner';
import { getWorldcups } from '../../action';

interface Props {
  sort?: 'latest' | 'popular';
  category?: string;
  query?: string;
}

export default function SearchContent({ sort, category, query }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['worldcups', { sort, category, query }],
    queryFn: ({ pageParam }) => getWorldcups({ sort, category, query, cursor: pageParam }),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  });
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const worldcupCards = data?.pages.flatMap((page) => page?.data) || [];

  useEffect(() => {
    if (inView && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, hasNextPage]);

  return (
    <>
      <NavigationFilter />
      <Grid>
        {[...worldcupCards].map((worldcupCard) => (
          <WorldcupCard key={worldcupCard.id} worldcupCard={worldcupCard} />
        ))}
      </Grid>
      {hasNextPage && (
        <div ref={ref} className="flex items-center justify-center">
          {isFetching && <Spinner />}
        </div>
      )}
      <footer className="h-16"></footer>
    </>
  );
}
