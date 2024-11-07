'use client';

import { WorldcupCard } from '@/app/lib/types';
import Card from './card';
import { useEffect, useState } from 'react';
import Pagination from '../pagination';
import { useRouter } from 'next/navigation';

interface Props {
  totalPages: number;
  worldcupCards: WorldcupCard[];
  extended?: boolean;
  pageNumber: number;
  userId: string;
}

export default function CardGridPagination({
  worldcupCards,
  extended,
  pageNumber,
  userId,
  totalPages,
}: Props) {
  const [dropdownMenuIndex, setDropdownMenuIndex] = useState<number | null>(
    null
  );
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

  const handlePageNumberClick = async (pageNumber: number) => {
    router.push(`/wc/users/${userId}/${pageNumber}`, {
      scroll: false,
    });
  };

  return (
    <>
      <ul className='grid grid-cols-card-12rem sm:grid-cols-card-14rem md:grid-cols-card-16rem lg:grid-cols-card-18rem justify-center gap-2 mt-4'>
        {worldcupCards.map((worldcup, index: number) => (
          <Card
            key={worldcup.worldcupId}
            worldcupCard={worldcup}
            openDropdownMenu={dropdownMenuIndex === index}
            onOpenDropdownMenu={() => setDropdownMenuIndex(index)}
            onCloseDropdownMenu={() => setDropdownMenuIndex(null)}
            extended={extended}
          />
        ))}
      </ul>

      <div className='mt-6'>
        <Pagination
          totalPages={totalPages}
          currentPageNumber={pageNumber}
          range={2}
          onPageNumberClick={handlePageNumberClick}
          className=''
        />
      </div>
      <footer className='h-16'></footer>
    </>
  );
}
