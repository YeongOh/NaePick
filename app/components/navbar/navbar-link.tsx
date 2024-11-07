'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  href: string;
  children: React.ReactNode;
}

export default function NavbarLink({ href, children }: Props) {
  const pathname = usePathname();

  return (
    <Link
      className={`bg-white hover:bg-gray-50 p-2 active:bg-gray-100 transition-colors text-center text-base font-semibold rounded ${
        pathname.includes(href) ? 'text-primary-500' : 'text-slate-700'
      }`}
      href={href}
    >
      {children}
    </Link>
  );
}
