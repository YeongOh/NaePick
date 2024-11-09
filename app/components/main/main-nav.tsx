'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function MainNav() {
  const searchParams = useSearchParams();

  return (
    <nav className="flex m-2 p-2 gap-2">
      <Link
        href={`/search?sort=popular`}
        className={`px-3 py-2 text-base rounded ${
          searchParams.get('sort') === 'popular' || !searchParams.has('sort')
            ? 'text-white bg-primary-500'
            : 'text-slate-700 border bg-white hover:bg-gray-50 active:bg-gray-100'
        }`}
      >
        인기
      </Link>
      <Link
        href={`/search?sort=latest`}
        className={`px-3 py-2 text-base rounded ${
          searchParams.get('sort') === 'latest'
            ? 'text-white bg-primary-500'
            : 'text-slate-700 border bg-white hover:bg-gray-50 active:bg-gray-100'
        }`}
      >
        최신
      </Link>
    </nav>
  );
}
