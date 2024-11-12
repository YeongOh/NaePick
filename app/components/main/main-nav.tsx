'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface Props {
  children?: React.ReactNode;
}

export default function MainNav({ children }: Props) {
  const searchParams = useSearchParams();
  const path = usePathname();

  return (
    <nav className="m-2 flex items-center gap-2 p-2">
      <Link
        href={path === '/' || path === '/search' ? '/search?sort=popular' : `${path}?sort=popular`}
        className={`rounded px-3 py-2 text-base ${
          searchParams.get('sort') === 'popular' || !searchParams.has('sort')
            ? 'bg-primary-500 text-white'
            : 'border bg-white text-slate-700 hover:bg-gray-50 active:bg-gray-100'
        }`}
      >
        인기
      </Link>
      <Link
        href={path === '/' || path === '/search' ? '/search?sort=latest' : `${path}?sort=latest`}
        className={`rounded px-3 py-2 text-base ${
          searchParams.get('sort') === 'latest'
            ? 'bg-primary-500 text-white'
            : 'border bg-white text-slate-700 hover:bg-gray-50 active:bg-gray-100'
        }`}
      >
        최신
      </Link>
      {!path.includes('/category') && (
        <Link
          href={'/category'}
          className={`rounded px-3 py-2 text-base ${'border bg-white text-slate-700 hover:bg-gray-50 active:bg-gray-100'}`}
        >
          카테고리
        </Link>
      )}
      {children}
    </nav>
  );
}
