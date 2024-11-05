'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav className='flex m-2 p-2 gap-2'>
      <Link
        href={`/popular`}
        className={`px-3 py-2 text-base rounded ${
          pathname.includes('popular') || pathname === '/'
            ? 'text-white bg-primary-500'
            : 'text-slate-700 border bg-white hover:bg-gray-50 active:bg-gray-100'
        }`}
      >
        인기
      </Link>
      <Link
        href={`/latest`}
        className={`px-3 py-2 text-base rounded ${
          pathname.includes('latest')
            ? 'text-white bg-primary-500'
            : 'text-slate-700 border bg-white hover:bg-gray-50 active:bg-gray-100'
        }`}
      >
        최신
      </Link>
    </nav>
  );
}
