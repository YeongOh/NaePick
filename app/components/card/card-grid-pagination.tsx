'use client';

import Card from './card';
import { useEffect, useState } from 'react';
import Pagination from '../pagination';
import { useRouter } from 'next/navigation';
import { TCard } from '@/app/lib/types';

interface Props {
  count: number;
  worldcups: TCard[];
  extended?: boolean;
  page: number;
  userId: string;
}

export default function CardGridPagination({ worldcups, extended, page, userId, count }: Props) {
  const [dropdownMenuIndex, setDropdownMenuIndex] = useState<number | null>(null);
  const totalPages = Math.ceil((count || 0) / 5);
  const router = useRouter();

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
    if (dropdownMenuIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownMenuIndex]);

  const handlePageNumberClick = async (page: number) => {
    router.push(`/wc/users/${userId}?page=${page}`, {
      scroll: false,
    });
  };

  return (
    <>
      <ul className="grid grid-cols-card-12rem sm:grid-cols-card-14rem md:grid-cols-card-16rem lg:grid-cols-card-18rem justify-center gap-2 mt-4">
        {worldcups.map((worldcup, index: number) => (
          <Card
            key={worldcup.id}
            worldcupCard={worldcup}
            openDropdownMenu={dropdownMenuIndex === index}
            onOpenDropdownMenu={() => setDropdownMenuIndex(index)}
            onCloseDropdownMenu={() => setDropdownMenuIndex(null)}
            extended={extended}
          />
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
