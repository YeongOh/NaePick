'use client';

import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import NavigationFilter from '@/app/components/NavigationFilter';
import WorldcupCard from '@/app/components/WorldcupCard/WorldcupCard';
import Grid from '@/app/ui/Grid';
import LinkButton from '@/app/ui/LinkButton';
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

  // useEffect(() => {
  //   if (inView) {
  //     fetchNextPage();
  //   }
  // }, [inView, fetchNextPage]);

  return (
    <>
      <NavigationFilter />
      {worldcupCards.length === 0 && !isFetching && (
        <div className="mt-20 flex flex-col items-center justify-center gap-10 text-lg font-semibold text-slate-700">
          조건에 해당하는 이상형 월드컵을 찾지 못했습니다.
          <LinkButton href="/" variant="outline">
            홈으로
          </LinkButton>
        </div>
      )}
      <Grid>
        {worldcupCards.map((worldcupCard) => (
          <WorldcupCard key={worldcupCard.id} worldcupCard={worldcupCard} />
        ))}
      </Grid>
      <button onClick={() => fetchNextPage()}>load more</button>
      {/* {isFetchingNextPage ? <Spinner /> : <div ref={ref}></div>} */}
      {/* <div ref={ref} className="flex h-12 items-center justify-center">
        {isFetching && <Spinner />}
      </div> */}
    </>
  );
}
