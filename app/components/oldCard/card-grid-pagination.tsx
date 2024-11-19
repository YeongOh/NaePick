'use client';

import { useCallback } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { TCard } from '@/app/lib/types';

import Card from './card';
import Pagination from '../pagination';

interface Props {
  count: number;
  worldcups: TCard[];
  extended?: boolean;
  page: number;
  userId?: string;
}

export default function CardGridPagination({ worldcups, extended, page, userId, count }: Props) {
  const totalPages = Math.ceil((count || 0) / 5);
  const router = useRouter();
  const searchParams = useSearchParams();
  const path = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const handlePageNumberClick = async (page: number) => {
    router.push(`${path}?${createQueryString('page', `${page}`)}`, {
      scroll: false,
    });
  };

  return (
    <>
      <ul className="mt-4 grid grid-cols-card-12rem justify-center gap-2 sm:grid-cols-card-14rem md:grid-cols-card-16rem lg:grid-cols-card-18rem">
        {worldcups.map((worldcup, index: number) => (
          <Card key={worldcup.id} worldcupCard={worldcup} extended={userId ? true : false} />
        ))}
      </ul>

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
