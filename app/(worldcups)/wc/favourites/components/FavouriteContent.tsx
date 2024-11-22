'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import Pagination from '@/app/components/Pagination';
import WorldcupCard from '@/app/components/WorldcupCard/WorldcupCard';
import useQueryString from '@/app/hooks/useQueryString';
import { TCard } from '@/app/lib/types';
import Grid from '@/app/ui/Grid';
import Spinner from '@/app/ui/Spinner';
import { getMyWorldcupFavourites } from '../actions';
import LinkButton from '@/app/ui/LinkButton';

interface Props {
  page: number;
}

export default function FavouriteContent({ page }: Props) {
  const router = useRouter();
  const path = usePathname();
  const { createQueryString } = useQueryString();

  const { data: result, isLoading } = useQuery({
    queryKey: ['my-worldcup-favourites'],
    queryFn: () => getMyWorldcupFavourites(page),
  });
  const totalPages = Math.ceil((result?.count || 0) / 5);

  const handlePageNumberClick = async (page: number) => {
    router.push(`${path}?${createQueryString('page', `${page}`)}`, {
      scroll: false,
    });
  };

  return (
    <>
      {isLoading && (
        <div className="mt-12 flex items-center justify-center">
          <Spinner />
        </div>
      )}
      {!isLoading && result?.data?.length === 0 && (
        <div className="mt-12 flex w-full flex-col items-center justify-center">
          <p className="mb-4 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            아직 즐겨찾기한 이상형 월드컵이 없습니다.
          </p>
          <div className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">둘러보세요!</div>
          <div className="flex w-36 flex-col items-center justify-center">
            <LinkButton href="/" variant="primary" size="md" className="my-2">
              둘러보기
            </LinkButton>
          </div>
        </div>
      )}
      {!isLoading && result?.data?.length !== 0 && (
        <Grid className="mt-12">
          {result?.data.map((worldcupCard: TCard) => (
            <WorldcupCard key={worldcupCard.id} worldcupCard={worldcupCard} type="favourite" />
          ))}
        </Grid>
      )}
      {!isLoading && result?.data?.length !== 0 && (
        <div className="mt-6">
          <Pagination
            totalPages={totalPages}
            currentPageNumber={page}
            range={2}
            onPageNumberClick={handlePageNumberClick}
            className=""
          />
        </div>
      )}
    </>
  );
}
