'use client';

import { useCallback } from 'react';

import { X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { translateCategory } from '@/app/lib/types';

import Searchbar from './searchbar';

export default function MainNav() {
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const deleteQueryString = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name);

      return params.toString();
    },
    [searchParams],
  );

  return (
    <nav className="m-2 flex items-center gap-2 p-2">
      <Link
        href={'/search?' + createQueryString('sort', 'popular')}
        className={`rounded px-3 py-2 text-base ${
          searchParams.get('sort') === 'popular' || !searchParams.has('sort')
            ? 'bg-primary-500 text-white'
            : 'border bg-white text-slate-700 hover:bg-gray-50 active:bg-gray-100'
        }`}
      >
        인기
      </Link>
      <Link
        href={'/search?' + createQueryString('sort', 'latest')}
        className={`rounded px-3 py-2 text-base ${
          searchParams.get('sort') === 'latest'
            ? 'bg-primary-500 text-white'
            : 'border bg-white text-slate-700 hover:bg-gray-50 active:bg-gray-100'
        }`}
      >
        최신
      </Link>
      {searchParams.get('category') ? (
        <Link
          className="flex items-center justify-center rounded bg-primary-500 px-3 py-2 text-base text-white"
          href={'/search?' + deleteQueryString('category')}
        >
          {translateCategory(searchParams.get('category') || '')}
          <X size={'1.2rem'} />
        </Link>
      ) : (
        <Link
          href={'/category'}
          className={`rounded px-3 py-2 text-base ${'border bg-white text-slate-700 hover:bg-gray-50 active:bg-gray-100'}`}
        >
          카테고리
        </Link>
      )}
      <Searchbar />
    </nav>
  );
}
