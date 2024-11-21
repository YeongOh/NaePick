'use client';

import { usePathname, useRouter } from 'next/navigation';
import Pagination from '@/app/components/Pagination';
import WorldcupCard from '@/app/components/WorldcupCard/WorldcupCard';
import useQueryString from '@/app/hooks/useQueryString';
import { TCard } from '@/app/lib/types';
import Grid from '@/app/ui/Grid';

interface Props {
  count: number;
  worldcups: TCard[];
  page: number;
}

export default function FavouriteContent({ worldcups, page, count }: Props) {
  const totalPages = Math.ceil((count || 0) / 5);
  const router = useRouter();
  const path = usePathname();
  const { createQueryString } = useQueryString();

  const handlePageNumberClick = async (page: number) => {
    router.push(`${path}?${createQueryString('page', `${page}`)}`, {
      scroll: false,
    });
  };

  return (
    <>
      <Grid className="mt-12">
        {worldcups.map((worldcupCard) => (
          <WorldcupCard key={worldcupCard.id} worldcupCard={worldcupCard} type="favourite" />
        ))}
      </Grid>
      <div className="mt-6">
        <Pagination
          totalPages={totalPages}
          currentPageNumber={page}
          range={2}
          onPageNumberClick={handlePageNumberClick}
          className=""
        />
      </div>
      <footer className="h-16"></footer>
    </>
  );
}
