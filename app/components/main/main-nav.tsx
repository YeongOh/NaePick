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
    <nav className="flex m-2 p-2 gap-2 items-center">
      <Link
        href={path === '/' || path === '/search' ? '/search?sort=popular' : `${path}?sort=popular`}
        className={`px-3 py-2 text-base rounded ${
          searchParams.get('sort') === 'popular' || !searchParams.has('sort')
            ? 'text-white bg-primary-500'
            : 'text-slate-700 border bg-white hover:bg-gray-50 active:bg-gray-100'
        }`}
      >
        인기
      </Link>
      <Link
        href={path === '/' || path === '/search' ? '/search?sort=latest' : `${path}?sort=latest`}
        className={`px-3 py-2 text-base rounded ${
          searchParams.get('sort') === 'latest'
            ? 'text-white bg-primary-500'
            : 'text-slate-700 border bg-white hover:bg-gray-50 active:bg-gray-100'
        }`}
      >
        최신
      </Link>
      {children}
    </nav>
  );
}
