'use client';

import clsx from 'clsx';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import useQueryString from '@/app/hooks/useQueryString';
import { translateCategory } from '@/app/utils';
import Searchbar from './SearchBar';

export default function NavigationFilter() {
  const searchParams = useSearchParams();
  const { createQueryString, deleteQueryString } = useQueryString();

  return (
    <nav className="my-4 flex items-center gap-2 p-2">
      <Link
        href={'/search?' + createQueryString('sort', 'popular')}
        className={clsx(
          'rounded-md px-3 py-2 text-base font-semibold',
          searchParams.get('sort') === 'popular' || !searchParams.has('sort')
            ? 'bg-primary-500 text-white'
            : 'border bg-white text-slate-600 hover:bg-gray-50 active:bg-gray-100',
        )}
      >
        인기
      </Link>
      <Link
        href={'/search?' + createQueryString('sort', 'latest')}
        className={clsx(
          'rounded-md px-3 py-2 text-base font-semibold',
          searchParams.get('sort') === 'latest'
            ? 'bg-primary-500 text-white'
            : 'border bg-white text-slate-600 hover:bg-gray-50 active:bg-gray-100',
        )}
      >
        최신
      </Link>
      {searchParams.get('category') ? (
        <Link
          className="flex items-center justify-center rounded-md bg-primary-500 px-3 py-2 text-base font-semibold text-white"
          href={'/search?' + deleteQueryString('category')}
        >
          {translateCategory(searchParams.get('category') || '')}
          <X size={'1.2rem'} />
        </Link>
      ) : (
        <Link
          href="/category"
          className="rounded-md border bg-white px-3 py-2 text-base font-semibold text-slate-600 hover:bg-gray-50 active:bg-gray-100"
        >
          카테고리
        </Link>
      )}
      <Searchbar />
    </nav>
  );
}
